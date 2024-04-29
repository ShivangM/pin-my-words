import { BoardAccess } from '@/interfaces/Board.d';
import fetchUserAccess from '../Users/fetchUserAccess';
import db, { storage } from '@/utils/firebase';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { Notification, NotificationType } from '@/interfaces/Notification.d';
import addNotificationToBoard from '../Notifications/addNotifictionToBoard';

const deleteWordFromBoard = async (
  boardId: string,
  wordId: string,
  userId: string
): Promise<Notification> => {
  try {
    const userAccess = await fetchUserAccess(boardId, userId);

    if (userAccess === BoardAccess.READ_ONLY) {
      throw new Error('You do not have permission to edit this board');
    }

    const wordRef = doc(db, 'boards', boardId, 'words', wordId);
    const wordDoc = await getDoc(wordRef);

    if (!wordDoc.exists()) {
      throw new Error('Word does not exist');
    }

    const word = wordDoc.data();

    const rootsWordsCollection = collection(
      db,
      'boards',
      boardId,
      'roots-words'
    );
    const q = query(rootsWordsCollection, where('wordId', '==', wordId));
    const queryDocs = await getDocs(q);

    const deletePromises: Promise<void>[] = [];

    queryDocs.forEach((doc) => {
      const deletePromise = deleteDoc(doc.ref);
      deletePromises.push(deletePromise);
    });

    // Wait for all promises to complete before returning
    await Promise.all(deletePromises);
    await deleteDoc(wordRef);

    //Deleting images from storage if existed
    if (word.image) {
      const imageRef = ref(storage, 'boards/' + boardId + '/words/' + wordId);
      await deleteObject(imageRef);
    }

    const actionFromRef = doc(db, 'users', userId);

    const notification = {
      type: NotificationType.WORD_DELETED,
      actionFrom: actionFromRef,
      actionTo: word.word,
    } as Notification;

    const addedNotification = addNotificationToBoard(
      boardId,
      userId,
      notification
    );
    return addedNotification;
  } catch (error) {
    throw error;
  }
};

export default deleteWordFromBoard;
