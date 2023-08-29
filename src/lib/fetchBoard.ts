import db from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

const fetchBoard = async (userId: string, boardId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const boardRef = doc(db, 'boards', boardId);

    const board = (await getDoc(boardRef)).data();
    if (!board) {
      throw new Error('Board does not exist');
    }

    if (board.users.findIndex((user: any) => user.id === userId) === -1) {
      throw new Error('User is not a member of this board');
    }

    return board;
  } catch (error) {
    console.error(error);
  }
};

export default fetchBoard;
