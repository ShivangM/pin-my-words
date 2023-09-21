import { Board } from '@/interfaces/Board';
import db from '@/utils/firebase';
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
} from 'firebase/firestore';
import fetchUserAccess from '../Users/fetchUserAccess';

const fetchBoard = async (boardId: string, userId: string): Promise<Board> => {
  try {
    const userAccess = await fetchUserAccess(boardId, userId);

    if (!userAccess) {
      throw new Error('User does not have access to this board');
    }

    const boardRef = doc(db, 'boards', boardId);
    const boardDoc = await getDoc(boardRef);

    if (!boardDoc.exists()) {
      throw new Error('Board does not exist');
    }

    const wordsCollection = collection(db, 'boards', boardId, 'words');
    const rootWordsCollection = collection(db, 'boards', boardId, 'roots');
    const notificationsCollection = collection(
      db,
      'boards',
      boardId,
      'notifications'
    );

    const totalWordsSnapshot = await getCountFromServer(wordsCollection);
    const totalRootWordsSnapshot = await getCountFromServer(
      rootWordsCollection
    );
    const totalNotificationsSnapshot = await getCountFromServer(
      notificationsCollection
    );

    const totalWords = totalWordsSnapshot.data().count;
    const totalRootWords = totalRootWordsSnapshot.data().count;

    const board = {
      ...boardDoc.data(),
      _id: boardDoc.id,
      totalWords,
      totalRootWords,
    } as Board;
    return board;
  } catch (error) {
    throw error;
  }
};

export default fetchBoard;
