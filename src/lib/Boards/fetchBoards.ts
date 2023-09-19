import { Board } from '@/interfaces/Board.d';
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
  where,
} from 'firebase/firestore';

const fetchBoards = async (
  uid: string,
  lim: number,
  lastVisibleDocId?: string
): Promise<Board[]> => {
  let boards: Board[] = [];

  try {
    const userBoardCollection = collection(db, 'users-boards');

    const lastDoc = lastVisibleDocId
      ? doc(userBoardCollection, lastVisibleDocId)
      : null;
    const lastDocSnapshot = lastDoc ? await getDoc(lastDoc) : null;

    const q = lastDocSnapshot
      ? query(
          userBoardCollection,
          where('userId', '==', uid),
          orderBy('createdAt', 'desc'),
          limit(lim),
          startAfter(lastDocSnapshot)
        )
      : query(
          userBoardCollection,
          where('userId', '==', uid),
          orderBy('createdAt', 'desc'),
          limit(lim)
        );

    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.size);

    // Create an array to hold all the promises
    const fetchPromises: Promise<void>[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const boardId = docSnapshot.data().boardId;
      const boardDocRef = doc(db, 'boards', boardId);
      const fetchPromise = getDoc(boardDocRef).then((boardDoc) => {
        const board = boardDoc.data();
        boards.push({ ...board, _id: boardDoc.id } as Board);
      });

      fetchPromises.push(fetchPromise);
    });

    // Wait for all promises to complete before returning
    await Promise.all(fetchPromises);
  } catch (error) {
    throw error;
  }

  return boards;
};

export default fetchBoards;
