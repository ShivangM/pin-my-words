import { BoardAccess } from '@/interfaces/Board';
import db from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

const fetchUserAccessByBoardIdAndUserEmail = async (
  boardId: string,
  userEmail: string
): Promise<BoardAccess | null> => {
  try {
    const userBoardRef = doc(db, 'users-boards', userEmail + '_' + boardId);
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

export default fetchUserAccessByBoardIdAndUserEmail;
