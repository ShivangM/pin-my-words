import { PaginatedResponse } from '@/interfaces/Typings';
import { RootWord } from '@/interfaces/Word';
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
} from 'firebase/firestore';
import fetchUserAccessByBoardIdAndUserId from '../Users/fetchUserAccess';

const fetchRootWords = async (
  boardId: string,
  userId: string,
  nextQuery?: Query<DocumentData, DocumentData>
): Promise<PaginatedResponse<RootWord[]>> => {
  try {
    const userAccess = await fetchUserAccessByBoardIdAndUserId(boardId, userId);

    if (!userAccess) {
      throw new Error('User does not have write access to this board');
    }

    const boardRef = doc(db, 'boards', boardId);
    const boardDoc = await getDoc(boardRef);

    if (!boardDoc.exists()) {
      throw new Error('Board does not exist');
    }

    const rootWordsCollection = collection(db, boardRef.path + '/roots');

    const rootWordsQuery =
      nextQuery || query(rootWordsCollection, orderBy('createdAt'), limit(6));

    const rootWordDocs = await getDocs(rootWordsQuery);

    // Has more
    let hasMore = rootWordDocs.size === 6;

    // Next query
    let nextQueryData: Query<DocumentData, DocumentData> | undefined;

    if (hasMore) {
      const lastVisible = rootWordDocs.docs[rootWordDocs.docs.length - 1];
      nextQueryData = query(
        rootWordsCollection,
        orderBy('createdAt'),
        startAfter(lastVisible),
        limit(6)
      );
    }

    let rootWords: RootWord[] = [];

    rootWordDocs.forEach((doc) => {
      const docData = doc.data();
      rootWords.push({ ...docData, _id: doc.id } as RootWord);
    });

    return {
      data: rootWords,
      hasMore,
      nextQuery: nextQueryData,
    };
  } catch (error) {
    throw error;
  }
};

export default fetchRootWords;
