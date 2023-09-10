import { Board, Metadata } from '@/interfaces/Board.d';
import db, { storage } from '@/utils/firebase';
import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const updateBoard = async (
  userId: string,
  boardId: string,
  metadata: Metadata,
  image: File | null
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

    // Updating image from storage if existed
    if (image) {
      const imageRef = ref(storage, 'boards/' + boardId + '/' + "cover");
      const imageBlob = new Blob([image], { type: 'image/jpeg' });

      await uploadBytes(imageRef, imageBlob, {
        contentType: 'image/jpeg',
      }).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          updateDoc(boardRef, {
            metadata: {
              ...metadata,
              image: downloadURL,
              updatedAt: Timestamp.now(),
            },
          });
        });
      });
    }

    const updatedBoard = {
      ...board,
      metadata: {
        ...metadata,
        updatedAt: Timestamp.now(),
        image: image ? URL.createObjectURL(image) : board.metadata.image,
      },
    }

    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

export default updateBoard;
