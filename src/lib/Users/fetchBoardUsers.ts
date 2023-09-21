import { BoardAccess, BoardUser } from '@/interfaces/Board';
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
import fetchUserAccess from './fetchUserAccess';
import fetchUser from './fetchUser';
import { PaginatedResponse } from '@/interfaces/Typings.d';

const fetchBoardUsers = async (
  boardId: string,
  userId: string,
  nextQuery?: Query<DocumentData, DocumentData>
): Promise<PaginatedResponse<BoardUser[]>> => {
  try {
    const boardRef = doc(db, 'boards', boardId);
    const boardDoc = await getDoc(boardRef);

    if (!boardDoc.exists()) {
      throw new Error('Board does not exist');
    }

    const userAccess = await fetchUserAccess(boardId, userId);

    if (!userAccess) {
      throw new Error('User does not have access to this board');
    }

    const boardUsersCollection = collection(db, 'users-boards');

    const boardUsersQuery =
      nextQuery ||
      query(
        boardUsersCollection,
        where('boardId', '==', boardId),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

    const userDocs = await getDocs(boardUsersQuery);

    // Has more
    let hasMore = userDocs.size === 10;

    // Next query
    let nextQueryData: Query<DocumentData, DocumentData> | undefined;

    if (hasMore) {
      const lastVisible = userDocs.docs[userDocs.docs.length - 1];
      nextQueryData = query(
        boardUsersCollection,
        where('boardId', '==', boardId),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(10)
      );
    }

    let userResults: BoardUser[] = [];

    for await (const userDoc of userDocs.docs) {
      const docData = userDoc.data();
      const access = docData.access as BoardAccess;
      const user = await fetchUser(docData.userId);
      userResults.push({
        access,
        ...user,
        uid: docData.userId,
      });
    }

    return {
      data: userResults,
      hasMore,
      nextQuery: nextQueryData,
    };
  } catch (error) {
    throw error;
  }
};

export default fetchBoardUsers;
