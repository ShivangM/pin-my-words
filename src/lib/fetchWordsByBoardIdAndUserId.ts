import { Word } from '@/interfaces/Word';
import db from '@/utils/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import fetchUserAccessByBoardIdAndUserId from './fetchUserAccessByBoardIdAndUserId';

const fetchWordsByBoardIdAndUserId = async (boardId: string, userId: string): Promise<Word[]> => {
  try {
    const userAccess = await fetchUserAccessByBoardIdAndUserId(
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
      const word = { ...wordDoc.data(), _id: wordDoc.id } as Word;
      words.push(word);
    });

    return words;
  } catch (error) {
    throw error;
  }
};

export default fetchWordsByBoardIdAndUserId;
