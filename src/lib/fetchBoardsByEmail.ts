import { Board } from '@/interfaces/Board';
import db from '@/utils/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

const fetchBoardsByEmail = async (email: string) => {
  try {
    const userBoardCollection = collection(db, 'users-boards');
    const q = query(userBoardCollection, where('userId', '==', email));
    const querySnapshot = await getDocs(q);

    let boards: Board[] = [];

    querySnapshot.forEach(async (docSnapshot) => {
      const boardId = await docSnapshot.data().boardId;
      const boardDocRef = doc(db, 'boards', boardId);
      const boardDoc = await getDoc(boardDocRef);

      boards.push({ ...boardDoc.data(), _id: boardDoc.id } as Board);
    });

    return boards;
  } catch (error) {
    console.error(error);
  }
};

export default fetchBoardsByEmail;
