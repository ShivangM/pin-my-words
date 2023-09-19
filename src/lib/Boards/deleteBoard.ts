import { Board } from '@/interfaces/Board';
import db, { storage } from '@/utils/firebase';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

const deleteBoard = async (userId: string, boardId: string): Promise<void> => {
  try {
    const boardRef = doc(db, 'boards', boardId);
    const boardDoc = await getDoc(boardRef);

    if (!boardDoc.exists()) {
      throw new Error('Board does not exist');
    }

    const board = boardDoc.data() as Board;

    if (board.owner !== userId) {
      throw new Error('User does not have access to delete this board');
    }

    const fetchPromises: Promise<void>[] = [];

    const boardsUsersRef = collection(db, 'users-boards');
    const q = query(boardsUsersRef, where('boardId', '==', boardId));
    const boardsUsersDocs = await getDocs(q);

    boardsUsersDocs.forEach((boardUserDoc) => {
      const docData = boardUserDoc.data();
      const userId = docData.userId;
      const userDoc = doc(db, 'users', userId);

      updateDoc(userDoc, {
        totalBoards: increment(-1),
      });

      const fetchPromise = deleteDoc(boardUserDoc.ref);
      fetchPromises.push(fetchPromise);
    });

    // Wait for all promises to complete before returning
    await Promise.all(fetchPromises);
    await deleteDoc(boardRef);

    //Deleting images from storage if existed
    if (board.image) {
      const imageRef = ref(storage, 'boards/' + boardId + '/cover');
      await deleteObject(imageRef);
    }
  } catch (error) {
    throw error;
  }
};

export default deleteBoard;
