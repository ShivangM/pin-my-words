import { BoardAccess } from '@/interfaces/Board';
import db from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

const fetchUserAccess = async (
  boardId: string,
  userId: string
): Promise<BoardAccess | null> => {
  try {
    const userBoardRef = doc(db, 'users-boards', userId + '_' + boardId);
    const userBoardDoc = await getDoc(userBoardRef);

    if (!userBoardDoc.exists()) {
      return null;
    }

    return userBoardDoc.data().access as BoardAccess;
  } catch (error) {
    throw error;
  }
};

export default fetchUserAccess;
