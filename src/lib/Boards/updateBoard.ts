import { Board } from '@/interfaces/Board.d';
import { Notification, NotificationType } from '@/interfaces/Notification.d';
import { ResponseWithNotification } from '@/interfaces/Typings';
import db, { storage } from '@/utils/firebase';
import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import addNotificationToBoard from '../Notifications/addNotifictionToBoard';

const updateBoard = async (
  userId: string,
  boardId: string,
  boardData: Board,
  image?: File
): Promise<ResponseWithNotification<Board>> => {
  try {
    const boardRef = doc(db, 'boards', boardId);
    const boardDoc = await getDoc(boardRef);

    if (!boardDoc.exists()) {
      throw new Error('Board does not exist');
    }

    let board = boardDoc.data() as Board;

    if (board.owner !== userId) {
      throw new Error('User does not have access to edit this board');
    }

    let imageUrl = board.image;

    // Updating image from storage if existed
    if (image) {
      const imageRef = ref(storage, 'boards/' + boardId + '/' + 'cover');
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);

      updateDoc(boardRef, {
        ...boardData,
        image: imageUrl,
        updatedAt: Timestamp.now(),
      });
    } else {
      await updateDoc(boardRef, { ...boardData, updatedAt: Timestamp.now() });
    }

    const updatedBoard = {
      ...boardData,
      image: imageUrl,
      updatedAt: Timestamp.now(),
    };

    const userRef = doc(db, 'users', userId);

    const notification = {
      type: NotificationType.BOARD_UPDATED,
      actionFrom: userRef,
    } as Notification;

    const notificationAdded = await addNotificationToBoard(
      boardId,
      userId,
      notification
    );

    return { data: updatedBoard, notification: notificationAdded };
  } catch (error) {
    throw error;
  }
};

export default updateBoard;
