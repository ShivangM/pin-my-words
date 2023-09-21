import db from '@/utils/firebase';
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  startAfter,
} from 'firebase/firestore';
import fetchUserAccess from '../Users/fetchUserAccess';
import { Notification } from '@/interfaces/Notification';
import { PaginatedResponse } from '@/interfaces/Typings';

const fetchNotificationsFromBoard = async (
  boardId: string,
  userId: string,
  nextQuery?: Query<DocumentData, DocumentData>
): Promise<PaginatedResponse<Notification[]>> => {
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

    const notificationsCollection = collection(
      db,
      boardRef.path,
      'notifications'
    );

    const notificationsQuery =
      nextQuery ||
      query(notificationsCollection, orderBy('createdAt', 'desc'), limit(10));

    const notificationsSnapshot = await getDocs(notificationsQuery);

    // Has more
    let hasMore = notificationsSnapshot.size === 10;

    // Next query
    let nextQueryData: Query<DocumentData, DocumentData> | undefined;

    if (hasMore) {
      const lastVisible =
        notificationsSnapshot.docs[notificationsSnapshot.docs.length - 1];
      nextQueryData = query(
        notificationsCollection,
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(10)
      );
    }

    const notifications: Notification[] = [];

    notificationsSnapshot.forEach((notificationDoc) => {
      const notification = notificationDoc.data() as Notification;
      notifications.push({
        ...notification,
        _id: notificationDoc.id,
      });
    });

    return {
      data: notifications,
      hasMore,
      nextQuery: nextQueryData,
    };
  } catch (error) {
    throw error;
  }
};

export default fetchNotificationsFromBoard;
