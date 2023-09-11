import { Board, Metadata } from '@/interfaces/Board.d';
import db, { storage } from '@/utils/firebase';
import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const updateBoard = async (
  userId: string,
  boardId: string,
  metadata: Metadata,
  image?: File
): Promise<Board> => {
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

    await updateDoc(boardRef, { metadata, updatedAt: Timestamp.now() });

    let imageUrl = board.metadata.image;

    // Updating image from storage if existed
    if (image) {
      const imageRef = ref(storage, 'boards/' + boardId + '/' + "cover");
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);

      updateDoc(boardRef, {
        metadata: {
          ...metadata,
          image: imageUrl,
          updatedAt: Timestamp.now(),
        },
      });
    }

    const updatedBoard = {
      ...board,
      metadata: {
        ...metadata,
        updatedAt: Timestamp.now(),
        image: imageUrl,
      },
    }

    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

export default updateBoard;
