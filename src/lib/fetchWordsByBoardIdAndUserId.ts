import { RootWord, Word } from '@/interfaces/Word';
import db from '@/utils/firebase';
import { DocumentData, DocumentSnapshot, collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
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
      const wordData = wordDoc.data() as Word;
      const roots = wordData.roots as string[];

      let rootDocPromises: Promise<DocumentSnapshot<DocumentData, DocumentData>>[] = [];

      roots?.forEach((root) => {
        const rootDocPromise = getDoc(doc(db, 'boards', boardId, 'roots', root));
        rootDocPromises.push(rootDocPromise);
      });

      const rootWords: RootWord[] = [];

      Promise.all(rootDocPromises).then((rootDocs) => {
        rootDocs.forEach((rootDoc) => {
          const rootData = rootDoc.data() as RootWord;
          const rootWord = { ...rootData, _id: rootDoc.id };
          rootWords.push(rootWord);
        });
      });

      const word = { ...wordData, roots: rootWords, _id: wordDoc.id };
      words.push(word);
    });

    return words;
  } catch (error) {
    throw error;
  }
};

export default fetchWordsByBoardIdAndUserId;
