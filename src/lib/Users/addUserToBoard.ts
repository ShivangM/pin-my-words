import db from '@/utils/firebase';
import { Timestamp, doc, getDoc, setDoc, collection } from 'firebase/firestore';
import fetchUserAccess from './fetchUserAccess';
import { BoardAccess, BoardUser } from '@/interfaces/Board.d';
import { ResponseWithNotification } from '@/interfaces/Typings';
import { Notification, NotificationType } from '@/interfaces/Notification.d';
import addNotificationToBoard from '../Notifications/addNotifictionToBoard';

const addUserToBoard = async (
  boardId: string,
  userId: string,
  user: BoardUser
): Promise<ResponseWithNotification<BoardUser>> => {
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
      throw new Error('User does not have access to add users to this board');
    }

    const usersBoardsCollection = collection(db, 'users-boards');
    const userDoc = doc(usersBoardsCollection, user.uid! + '_' + boardRef.id);
    const userDocRef = await getDoc(userDoc);

    if (userDocRef.exists()) {
      throw new Error('User already has access to this board');
    }

    await setDoc(doc(db, 'users-boards', user.uid! + '_' + boardRef.id), {
      boardId: boardRef.id,
      userId: user.uid!,
      access: user.access,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const actionFromRef = doc(db, 'users', userId);
    const actionToRef = doc(db, 'users', user.uid!);

    const notification = {
      type: NotificationType.USER_ADDED,
      actionFrom: actionFromRef,
      actionTo: actionToRef,
    } as Notification;

    const addedNotification = await addNotificationToBoard(
      boardId,
      userId,
      notification
    );

    return {
      data: user,
      notification: addedNotification,
    };
  } catch (error) {
    throw error;
  }
};

export default addUserToBoard;
