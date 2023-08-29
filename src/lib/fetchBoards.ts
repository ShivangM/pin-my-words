import { Board } from '@/interfaces/Board';
import db from '@/utils/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

const fetchBoards = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const boardCollection = collection(db, 'boards');
    const q = query(boardCollection, where('users', 'array-contains', userRef));

    const querySnapshot = await getDocs(q);
    let boards: Board[] = [];
    querySnapshot.forEach((doc) => {
      boards.push({ ...doc.data(), _id: doc.id } as Board);
    });

    return boards;
  } catch (error) {
    console.error(error);
  }
};

export default fetchBoards;
