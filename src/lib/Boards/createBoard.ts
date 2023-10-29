import { Board, BoardAccess, BoardUser } from '@/interfaces/Board.d';
import db, { storage } from '@/utils/firebase';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  setDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const createBoard = async (
  board: Board,
  users?: BoardUser[],
  image?: File
): Promise<Board> => {
  try {
    const boardsCollection = collection(db, 'boards');
    const boardRef = await addDoc(boardsCollection, {
      ...board,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    //Add owner to board
    await setDoc(doc(db, 'users-boards', board.owner + '_' + boardRef.id), {
      boardId: boardRef.id,
      userId: board.owner,
      access: BoardAccess.OWNER,
    });

    await updateDoc(doc(db, 'users', board.owner), {
      totalBoards: increment(1),
    });

    //Add users to board
    if (users) {
      let addUserPromises: Promise<void>[] = [];

      users.forEach(async (user) => {
        const addUserPromise = setDoc(
          doc(db, 'users-boards', user.uid! + '_' + boardRef.id),
          {
            boardId: boardRef.id,
            userId: user.uid!,
            access: user.access,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          }
        );

        await updateDoc(doc(db, 'users', user.uid), {
          totalBoards: increment(1),
        });

        addUserPromises.push(addUserPromise);
      });

      await Promise.all(addUserPromises);
    }

    //Upload Image to Storage
    let imageUrl = undefined;

    if (image) {
      const imageRef = ref(storage, 'boards/' + boardRef.id + '/' + 'cover');
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
      await updateDoc(doc(db, 'boards', boardRef.id), { image: imageUrl });
    }

    const createdBoard = {
      ...board,
      _id: boardRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      image: imageUrl,
    };

    return createdBoard;
  } catch (error) {
    throw error;
  }
};

export default createBoard;
