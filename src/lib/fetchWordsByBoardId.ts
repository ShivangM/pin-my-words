import { Word } from '@/interfaces/Word';
import db from '@/utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

const fetchWordsByBoardId = async (boardId: string): Promise<Word[] | null> => {
  try {
    const wordsCollection = collection(db, 'boards', boardId, 'words');
    const wordsDocs = await getDocs(wordsCollection);
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
