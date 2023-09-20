import { RootWord } from '@/interfaces/Word.d';
import db from '@/utils/firebase';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';

const fetchRootsBySearchTerm = async (
  searchTerm: string,
  boardId: string
): Promise<RootWord[]> => {
  console.log(searchTerm);

  const rootsQuery = query(
    collection(db, 'boards', boardId, 'roots'),
    orderBy('root', 'asc'),
    where('root', '>=', searchTerm),
    where('root', '<=', searchTerm + '\uf8ff'),
    limit(10)
  );

  const rootDocs = await getDocs(rootsQuery);
  let rootResults: RootWord[] = [];

  console.log(rootDocs.size);

  rootDocs.forEach((doc) => {
    const root = doc.data() as RootWord;
    rootResults.push({ ...root, _id: doc.id });
  });

  return rootResults;
};

export default fetchRootsBySearchTerm;
