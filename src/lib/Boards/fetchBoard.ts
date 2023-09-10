import { Board } from '@/interfaces/Board';
import db from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import fetchUserAccess from '../Users/fetchUserAccess';

const fetchBoard = async (
  boardId: string,
  userId: string
): Promise<Board> => {
  try {
    const userAccess = await fetchUserAccess(
      boardId,
      userId
    );

    if (!userAccess) {
      throw new Error('User does not have access to this board');
    }

    const boardRef = doc(db, 'boards', boardId);
    const boardDoc = await getDoc(boardRef);

    if (!boardDoc.exists()) {
      throw new Error('Board does not exist');
    }

    const board = { ...boardDoc.data(), _id: boardDoc.id } as Board;
    return board;

  } catch (error) {
    throw error;
  }
};

export default fetchBoard;
