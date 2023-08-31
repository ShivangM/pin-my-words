import { Board } from '@/interfaces/Board.d';
import db from '@/utils/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

const fetchBoardsByEmail = async (email: string): Promise<Board[]> => {
  let boards: Board[] = [];

  try {
    const userBoardCollection = collection(db, 'users-boards');
    const q = query(userBoardCollection, where('userId', '==', email));
    const querySnapshot = await getDocs(q);

    // Create an array to hold all the promises
    const fetchPromises: Promise<void>[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const boardId = docSnapshot.data().boardId;
      const boardDocRef = doc(db, 'boards', boardId);
      const fetchPromise = getDoc(boardDocRef).then((boardDoc) => {
        const board = boardDoc.data();
        boards.push({ ...board, _id: boardDoc.id } as Board);
      });

      fetchPromises.push(fetchPromise);
    });

    // Wait for all promises to complete before returning
    await Promise.all(fetchPromises);
  } catch (error) {
    console.error(error);
  }

  return boards;
};

export default fetchBoardsByEmail;
