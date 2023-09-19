import { RootWord } from '@/interfaces/Word';
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
} from 'firebase/firestore';
import fetchUserAccessByBoardIdAndUserId from '../Users/fetchUserAccess';

const fetchRootWords = async (
  boardId: string,
  userId: string,
  lim: number,
  lastVisibleDocId?: string
): Promise<RootWord[]> => {
  let rootWords: RootWord[] = [];

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

    const lastDoc = lastVisibleDocId
      ? doc(db, 'boards', boardId, 'roots', lastVisibleDocId)
      : null;

    const lastDocSnapshot = lastDoc ? await getDoc(lastDoc) : null;

    const rootWordsCollection = collection(db, boardRef.path + '/roots');

    const rootWordsQuery = lastDocSnapshot
      ? query(
          rootWordsCollection,
          orderBy('createdAt'),
          limit(lim),
          startAfter(lastDocSnapshot)
        )
      : query(rootWordsCollection, orderBy('createdAt'), limit(lim));

    const rootWordDocs = await getDocs(rootWordsQuery);

    rootWordDocs.forEach((doc) => {
      const docData = doc.data();
      rootWords.push({ ...docData, _id: doc.id } as RootWord);
    });

    return rootWords;
  } catch (error) {
    throw error;
  }
};

export default fetchRootWords;
