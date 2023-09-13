import { Word } from '@/interfaces/Word';
import db from '@/utils/firebase';
import { Timestamp, collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import fetchUserAccess from '../Users/fetchUserAccess';
import { DayValue } from 'react-modern-calendar-datepicker';

const fetchWords = async (boardId: string, userId: string, date?: DayValue): Promise<Word[]> => {
  try {
    const userAccess = await fetchUserAccess(
      boardId,
      userId
    );

    if (!userAccess) {
      throw new Error('User does not have access to this board');
    }

    const wordsCollection = collection(db, 'boards', boardId, 'words');
    let q = query(wordsCollection, orderBy('createdAt', 'desc'));

    if (date) {
      const startDate = new Date(date.year, date.month - 1, date.day);
      const endDate = new Date(date.year, date.month - 1, date.day + 1);
      const startDateTimestamp = Timestamp.fromDate(startDate);
      const endDateTimestamp = Timestamp.fromDate(endDate);

      q = query(wordsCollection, where('createdAt', '>=', startDateTimestamp), where('createdAt', '<', endDateTimestamp), orderBy('createdAt', 'desc'));
    }

    const wordsDocs = await getDocs(q);

    const words: Word[] = [];

    const rootWordsCollection = collection(db, 'boards', boardId, 'roots-words');

    for await (const wordDoc of wordsDocs.docs) {
      const wordData = wordDoc.data() as Word;

      const roots: { label: string, value: string }[] = [];
      const queryRoots = query(rootWordsCollection, where("wordId", "==", wordDoc.id));
      const rootWordsDocs = await getDocs(queryRoots);

      for await (const rootWordDoc of rootWordsDocs.docs) {
        const rootWordDocData = rootWordDoc.data()
        roots.push({ label: rootWordDocData.label, value: rootWordDocData.rootId });
      }

      const word = { ...wordData, roots, _id: wordDoc.id };
      words.push(word);
    }

    return words;
  } catch (error) {
    throw error;
  }
};

export default fetchWords;
