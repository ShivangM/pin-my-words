import db from '@/utils/firebase';
import { Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import fetchUserAccess from './fetchUserAccess';
import { BoardAccess, BoardUser } from '@/interfaces/Board.d';
import { Notification, NotificationType } from '@/interfaces/Notification.d';
import addNotificationToBoard from '../Notifications/addNotifictionToBoard';

const updateUserAccess = async (
  user: BoardUser,
  userId: string,
  boardId: string,
  access: BoardAccess
): Promise<Notification> => {
  try {
    const boardRef = doc(db, 'boards', boardId);
    const boardDoc = await getDoc(boardRef);

    if (!boardDoc.exists()) {
      throw new Error('Board does not exist');
    }

    const userAccess = await fetchUserAccess(boardId, userId);

    if (
      !userAccess ||
      userAccess === BoardAccess.READ_ONLY ||
      userAccess === BoardAccess.READ_WRITE
    ) {
      throw new Error(
        'User does not have access to update users on this board'
      );
    }

    if (user.access === BoardAccess.OWNER) {
      throw new Error('User is the owner of the board and cannot be updated');
    }

    if (user.access === BoardAccess.ADMIN && userAccess !== BoardAccess.OWNER) {
      throw new Error('Admin cannot be updated by another admin');
    }

    const actionFromRef = doc(db, 'users', userId);
    const actionToRef = doc(db, 'users', user.uid!);

    const notification = {
      type: NotificationType.USER_UPDATED,
      actionFrom: actionFromRef,
      actionTo: actionToRef,
    } as Notification;

    const addedNotification = addNotificationToBoard(
      boardId,
      userId,
      notification
    );

    await updateDoc(doc(db, 'users-boards', user.uid! + '_' + boardRef.id), {
      access,
      updatedAt: Timestamp.now(),
    });

    return addedNotification;
  } catch (error) {
    throw error;
  }
};

export default updateUserAccess;
