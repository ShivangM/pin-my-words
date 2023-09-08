import { Board } from '@/interfaces/Board';
import db from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import fetchUserAccessByBoardIdAndUserId from './fetchUserAccessByBoardIdAndUserId';

const fetchBoardByUserEmailAndBoardId = async (
  boardId: string,
  userId: string
): Promise<Board | null> => {
  try {
    const boardRef = doc(db, 'boards', boardId);
    const boardDoc = await getDoc(boardRef);
    const board = { ...boardDoc.data(), _id: boardDoc.id } as Board;

    if (!board) {
      throw new Error('Board does not exist');
    }

    const userAccess = await fetchUserAccessByBoardIdAndUserId(
      boardId,
      userId
    );

    if (!userAccess) {
      throw new Error('User does not have access to this board');
    }

    return board;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default fetchBoardByUserEmailAndBoardId;
