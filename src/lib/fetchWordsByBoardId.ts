import { Word } from '@/interfaces/Word';
import db from '@/utils/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const fetchWordsByBoardId = async (boardId: string): Promise<Word[] | null> => {
  try {
    const wordsCollection = collection(db, 'boards', boardId, 'words');
    const q = query(wordsCollection, orderBy('createdAt', 'desc'));
    const wordsDocs = await getDocs(q);
    const words: Word[] = [];
    wordsDocs.forEach((wordDoc) => {
      const word = wordDoc.data() as Word;
      words.push(word);
    });

    return words;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default fetchWordsByBoardId;
