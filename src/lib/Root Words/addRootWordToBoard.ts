import { RootWord } from '@/interfaces/Word.d';
import db from '@/utils/firebase';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import fetchUserAccess from '../Users/fetchUserAccess';
import { BoardAccess } from '@/interfaces/Board.d';
import { ResponseWithNotification } from '@/interfaces/Typings';
import addNotificationToBoard from '../Notifications/addNotifictionToBoard';
import { Notification, NotificationType } from '@/interfaces/Notification.d';

const addRootWordToBoard = async (
  boardId: string,
  rootWord: RootWord,
  userId: string
): Promise<ResponseWithNotification<RootWord>> => {
  try {
    const boardRef = doc(db, 'boards', boardId);
    const boardDoc = await getDoc(boardRef);

    if (!boardDoc.exists()) {
      throw new Error('Board does not exist');
    }

    const userAccess = await fetchUserAccess(boardId, userId);

    if (!userAccess || userAccess === BoardAccess.READ_ONLY) {
      throw new Error('User does not have write access to this board');
    }

    const rootWordCollection = collection(db, boardRef.path + '/roots');
    const rootWordExistQuery = query(
      rootWordCollection,
      where('root', '==', rootWord.root.toLowerCase())
    );
    const rootWordExistDoc = await getDocs(rootWordExistQuery);

    if (!rootWordExistDoc.empty) {
      throw new Error('Root word already exists');
    }

    const rootWordDoc = await addDoc(rootWordCollection, {
      ...rootWord,
      root: rootWord.root.toLowerCase(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: userId,
    });

    const rootWordAdded = {
      ...rootWord,
      _id: rootWordDoc.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: userId,
    };

    const actionFrom = doc(db, 'users', userId);

    const notification = {
      type: NotificationType.ROOT_WORD_ADDED,
      actionFrom: actionFrom,
      actionTo: rootWordDoc,
    } as Notification;

    const notificationAdded = await addNotificationToBoard(
      boardId,
      userId,
      notification
    );

    return { data: rootWordAdded, notification: notificationAdded };
  } catch (error) {
    throw error;
  }
};

export default addRootWordToBoard;
