import { BoardAccess, BoardUser } from '@/interfaces/Board';
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
import fetchUserAccess from './fetchUserAccess';
import fetchUser from './fetchUser';

const fetchBoardUsers = async (
  boardId: string,
  userId: string,
  lim: number,
  lastVisibleDocId?: string
): Promise<BoardUser[]> => {
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

    const lastDoc = lastVisibleDocId
      ? doc(boardUsersCollection, lastVisibleDocId)
      : null;
    const lastDocSnapshot = lastDoc ? await getDoc(lastDoc) : null;

    const boardUsersQuery = lastDocSnapshot
      ? query(
          boardUsersCollection,
          where('boardId', '==', boardId),
          orderBy('createdAt', 'desc'),
          limit(lim),
          startAfter(lastDocSnapshot)
        )
      : query(
          boardUsersCollection,
          where('boardId', '==', boardId),
          orderBy('createdAt', 'desc'),
          limit(lim)
        );

    const userDocs = await getDocs(boardUsersQuery);
    let userResults: BoardUser[] = [];

    for await (const userDoc of userDocs.docs) {
      const docData = userDoc.data();
      const access = docData.access as BoardAccess;
      const user = await fetchUser(docData.userId);
      userResults.push({
        access,
        ...user,
        uid: docData.userId,
        _id: userDoc.id,
      });
    }

    return userResults;
  } catch (error) {
    throw error;
  }
};

export default fetchBoardUsers;
