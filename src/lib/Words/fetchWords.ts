import { RootWord, Word } from '@/interfaces/Word';
import db from '@/utils/firebase';
import { DocumentData, DocumentSnapshot, collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import fetchUserAccess from '../Users/fetchUserAccess';

const fetchWords = async (boardId: string, userId: string): Promise<Word[]> => {
  try {
    const userAccess = await fetchUserAccess(
      boardId,
      userId
    );

    if (!userAccess) {
      throw new Error('User does not have access to this board');
    }

    const wordsCollection = collection(db, 'boards', boardId, 'words');
    const q = query(wordsCollection, orderBy('createdAt', 'desc'));
    const wordsDocs = await getDocs(q);

    const words: Word[] = [];
    wordsDocs.forEach((wordDoc) => {
      const wordData = wordDoc.data() as Word;
      const word = { ...wordData, _id: wordDoc.id };
      words.push(word);
    });

    return words;
  } catch (error) {
    throw error;
  }
};

export default fetchWords;
