import { Board } from '@/interfaces/Board.d';
import { PaginatedResponse } from '@/interfaces/Typings';
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
  where,
} from 'firebase/firestore';

const fetchBoards = async (
  uid: string,
  nextQuery?: Query<DocumentData, DocumentData>
): Promise<PaginatedResponse<Board[]>> => {
  try {
    const userBoardCollection = collection(db, 'users-boards');

    const q =
      nextQuery ||
      query(
        userBoardCollection,
        where('userId', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

    const querySnapshot = await getDocs(q);

    // Has more
    let hasMore = querySnapshot.size === 10;

    // Next query
    let nextQueryData: Query<DocumentData, DocumentData> | undefined;

    if (hasMore) {
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      nextQueryData = query(
        userBoardCollection,
        where('userId', '==', uid),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(10)
      );
    }

    // Create an array to hold all the promises
    const fetchPromises: Promise<void>[] = [];
    let boards: Board[] = [];

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

    return {
      data: boards,
      hasMore,
      nextQuery: nextQueryData,
    };
  } catch (error) {
    throw error;
  }
};

export default fetchBoards;
