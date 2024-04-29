import db from '@/utils/firebase';
import { Timestamp, addDoc, collection, doc } from 'firebase/firestore';
import { Notification } from '@/interfaces/Notification.d';

const addNotificationToBoard = async (
  boardId: string,
  userId: string,
  notification: Notification
): Promise<Notification> => {
  try {
    const boardRef = doc(db, 'boards', boardId);

    const notificationsCollection = collection(
      db,
      boardRef.path,
      'notifications'
    );

    const notificationDoc = await addDoc(notificationsCollection, {
      ...notification,
      createdAt: Timestamp.now(),
      createdBy: userId,
    });

    const notificationAdded = {
      ...notification,
      _id: notificationDoc.id,
      createdAt: Timestamp.now(),
      createdBy: userId,
    };

    return notificationAdded;
  } catch (error) {
    throw error;
  }
};

export default addNotificationToBoard;
