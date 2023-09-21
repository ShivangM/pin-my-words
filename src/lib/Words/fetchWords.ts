import { Word } from '@/interfaces/Word.d';
import db from '@/utils/firebase';
import {
  Timestamp,
  collection,
  getDocs,
  orderBy,
  query,
  where,
  limit,
  startAfter,
  Query,
  DocumentData,
} from 'firebase/firestore';
import fetchUserAccess from '../Users/fetchUserAccess';
import { DayValue } from 'react-modern-calendar-datepicker';
import { Option, PaginatedResponse } from '@/interfaces/Typings.d';

const fetchWords = async (
  boardId: string,
  userId: string,
  date: DayValue | null,
  nextQuery?: Query<DocumentData, DocumentData>
): Promise<PaginatedResponse<Word[]>> => {
  try {
    // Check if user has access to this board
    const userAccess = await fetchUserAccess(boardId, userId);

    if (!userAccess) {
      throw new Error('User does not have access to this board');
    }

    const wordsCollection = collection(db, 'boards', boardId, 'words');

    // Query
    let q =
      nextQuery ||
      query(wordsCollection, orderBy('createdAt', 'desc'), limit(10));

    if (date && !nextQuery) {
      const startDate = new Date(date.year, date.month - 1, date.day);
      const endDate = new Date(date.year, date.month - 1, date.day + 1);
      const startDateTimestamp = Timestamp.fromDate(startDate);
      const endDateTimestamp = Timestamp.fromDate(endDate);

      q = query(
        wordsCollection,
        where('createdAt', '>=', startDateTimestamp),
        where('createdAt', '<', endDateTimestamp),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
    }

    const wordsDocs = await getDocs(q);

    // Has more
    let hasMore = wordsDocs.size === 10;

    // Next query
    let nextBatchQuery = undefined;

    if (hasMore) {
      const lastVisible = wordsDocs.docs[wordsDocs.docs.length - 1];

      if (date) {
        const startDate = new Date(date.year, date.month - 1, date.day);
        const endDate = new Date(date.year, date.month - 1, date.day + 1);
        const startDateTimestamp = Timestamp.fromDate(startDate);
        const endDateTimestamp = Timestamp.fromDate(endDate);

        nextBatchQuery = query(
          wordsCollection,
          where('createdAt', '>=', startDateTimestamp),
          where('createdAt', '<', endDateTimestamp),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(10)
        );
      } else {
        nextBatchQuery = query(
          wordsCollection,
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(10)
        );
      }
    }

    const words: Word[] = [];

    const rootWordsCollection = collection(
      db,
      'boards',
      boardId,
      'roots-words'
    );

    for await (const wordDoc of wordsDocs.docs) {
      const wordData = wordDoc.data() as Word;

      // Fetch roots
      const roots: Option[] = [];
      const queryRoots = query(
        rootWordsCollection,
        where('wordId', '==', wordDoc.id)
      );

      const rootWordsDocs = await getDocs(queryRoots);

      for (const rootWordDoc of rootWordsDocs.docs) {
        const rootWordDocData = rootWordDoc.data();
        roots.push({
          label: rootWordDocData.label,
          value: rootWordDocData.rootId,
        });
      }

      // Add word
      const word = { ...wordData, roots, _id: wordDoc.id };
      words.push(word);
    }

    return {
      data: words,
      hasMore,
      nextQuery: nextBatchQuery,
    };
  } catch (error) {
    throw error;
  }
};

export default fetchWords;
