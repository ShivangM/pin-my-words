import { BoardAccess } from '@/interfaces/Board';
import db from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

const fetchUserAccessByBoardIdAndUserId = async (
  boardId: string,
  userId: string
): Promise<BoardAccess | null> => {
  try {
    const userBoardRef = doc(db, 'users-boards', userId + '_' + boardId);
    const userBoardDoc = await getDoc(userBoardRef);
    if (!userBoardDoc.exists()) {
      throw new Error('User does not have access to this board');
    }

    return userBoardDoc.data().access as BoardAccess;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default fetchUserAccessByBoardIdAndUserId;
