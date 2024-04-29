import { Notification, NotificationType } from '@/interfaces/Notification.d';
import db from '@/utils/firebase';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import addNotificationToBoard from '../Notifications/addNotifictionToBoard';

const leaveBoard = async (boardId: string, userId: string): Promise<void> => {
  try {
    const boardRef = doc(db, 'boards', boardId);
    const boardDoc = await getDoc(boardRef);

    if (!boardDoc.exists()) {
      throw new Error('Board does not exist');
    }

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User does not exist');
    }

    const boardData = boardDoc.data();

    if (boardData?.owner === userId) {
      throw new Error(
        'Owner cannot leave board, delete board instead or transfer ownership to another user'
      );
    }

    const docRef = doc(db, 'users-boards', `${userId}_${boardId}`);

    const actionFromRef = doc(db, 'users', userId);

    const notification = {
      type: NotificationType.USER_LEFT,
      actionFrom: actionFromRef,
    } as Notification;

    addNotificationToBoard(boardId, userId, notification);

    await deleteDoc(docRef);
  } catch (error) {
    throw error;
  }
};

export default leaveBoard;
