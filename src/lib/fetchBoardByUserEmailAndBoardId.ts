import { Board } from '@/interfaces/Board';
import db from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import fetchUserAccessByBoardIdAndUserEmail from './fetchUserAccessByBoardIdAndUserEmail';

const fetchBoardByUserEmailAndBoardId = async (
  userEmail: string,
  boardId: string
): Promise<Board | null> => {
  try {
    const boardRef = doc(db, 'boards', boardId);
    const boardDoc = await getDoc(boardRef);
    const board = { ...boardDoc.data(), _id: boardDoc.id } as Board;

    if (!board) {
      throw new Error('Board does not exist');
    }

    const userAccess = await fetchUserAccessByBoardIdAndUserEmail(
      boardId,
      userEmail
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
