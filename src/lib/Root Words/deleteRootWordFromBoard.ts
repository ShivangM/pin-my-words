import { BoardAccess } from '@/interfaces/Board.d';
import fetchUserAccess from '../Users/fetchUserAccess';
import db from '@/utils/firebase';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { Notification, NotificationType } from '@/interfaces/Notification.d';
import addNotificationToBoard from '../Notifications/addNotifictionToBoard';

const deleteRootWordFromBoard = async (
  boardId: string,
  rootWordId: string,
  userId: string
): Promise<Notification> => {
  try {
    const userAccess = await fetchUserAccess(boardId, userId);

    if (userAccess === BoardAccess.READ_ONLY) {
      throw new Error('You do not have permission to edit this board');
    }

    const rootWordRef = doc(db, 'boards', boardId, 'roots', rootWordId);
    const rootWordDoc = await getDoc(rootWordRef);

    if (!rootWordDoc.exists()) {
      throw new Error('Root Word does not exist');
    }

    const rootWord = rootWordDoc.data();

    const rootsWordsCollection = collection(
      db,
      'boards',
      boardId,
      'roots-words'
    );
    const q = query(rootsWordsCollection, where('rootId', '==', rootWordId));
    const queryDocs = await getDocs(q);

    const deletePromises: Promise<void>[] = [];

    queryDocs.forEach((doc) => {
      const deletePromise = deleteDoc(doc.ref);
      deletePromises.push(deletePromise);
    });

    // Wait for all promises to complete before returning
    await Promise.all(deletePromises);

    const actionFrom = doc(db, 'users', userId);
    const actionTo = rootWord.root;

    const notification = {
      type: NotificationType.ROOT_WORD_DELETED,
      actionFrom: actionFrom,
      actionTo: actionTo,
    } as Notification;

    await deleteDoc(rootWordRef);
    const addedNotification = await addNotificationToBoard(
      boardId,
      userId,
      notification
    );

    return addedNotification;
  } catch (error) {
    throw error;
  }
};

export default deleteRootWordFromBoard;
