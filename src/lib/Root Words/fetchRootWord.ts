import { RootWord } from '@/interfaces/Word';
import db from '@/utils/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import fetchUserAccessByBoardIdAndUserId from '../Users/fetchUserAccess';

const fetchRootWord = async (
  boardId: string,
  rootId: string,
  userId: string
): Promise<RootWord> => {
  try {
    const userAccess = await fetchUserAccessByBoardIdAndUserId(boardId, userId);

    if (!userAccess) {
      throw new Error('User does not have write access to this board');
    }

    const boardRef = doc(db, 'boards', boardId);
    const boardDoc = await getDoc(boardRef);

    if (!boardDoc.exists()) {
      throw new Error('Board does not exist');
    }

    const rootWordsCollection = collection(db, boardRef.path + '/roots');
    const rootWordDoc = await getDoc(doc(rootWordsCollection, rootId));
    const rootWord = rootWordDoc.data() as RootWord;

    return rootWord;
  } catch (error) {
    throw error;
  }
};

export default fetchRootWord;
