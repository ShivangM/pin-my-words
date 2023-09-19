import db from '@/utils/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore';
import fetchUserAccess from '../Users/fetchUserAccess';
import { Notification } from '@/interfaces/Notification';

const fetchNotificationsFromBoard = async (
  boardId: string,
  userId: string,
  lim: number,
  lastVisibleDocId?: string
): Promise<Notification[]> => {
  try {
    const boardRef = doc(db, 'boards', boardId);
    const boardDoc = await getDoc(boardRef);

    if (!boardDoc.exists()) {
      throw new Error('Board does not exist');
    }

    const userAccess = await fetchUserAccess(boardId, userId);

    if (!userAccess) {
      throw new Error('User does not have access to this board');
    }

    const lastDoc = lastVisibleDocId
      ? doc(db, 'boards', boardId, 'notifications', lastVisibleDocId)
      : null;
    const lastDocSnapshot = lastDoc ? await getDoc(lastDoc) : null;

    const notificationsCollection = collection(
      db,
      boardRef.path,
      'notifications'
    );

    const notificationsQuery = lastDocSnapshot
      ? query(
          notificationsCollection,
          orderBy('createdAt', 'desc'),
          startAfter(lastDocSnapshot),
          limit(lim)
        )
      : query(
          notificationsCollection,
          orderBy('createdAt', 'desc'),
          limit(lim)
        );

    const notificationsSnapshot = await getDocs(notificationsQuery);

    const notifications: Notification[] = [];

    notificationsSnapshot.forEach((notificationDoc) => {
      const notification = notificationDoc.data() as Notification;
      notifications.push({
        ...notification,
        _id: notificationDoc.id,
      });
    });

    return notifications;
  } catch (error) {
    throw error;
  }
};

export default fetchNotificationsFromBoard;
