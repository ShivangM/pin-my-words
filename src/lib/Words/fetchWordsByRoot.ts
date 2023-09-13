import { Word } from '@/interfaces/Word';
import db from '@/utils/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import fetchUserAccess from '../Users/fetchUserAccess';

const fetchWordsByRoot = async (boardId: string, userId: string, rootWordId: string): Promise<Word[]> => {
    try {
        const userAccess = await fetchUserAccess(
            boardId,
            userId
        );

        if (!userAccess) {
            throw new Error('User does not have access to this board');
        }

        const rootWordsCollection = collection(db, 'boards', boardId, 'roots-words');
        const wordsDocsQuery = query(rootWordsCollection, where('rootId', '==', rootWordId), orderBy('createdAt', 'desc'));
        const wordsDocs = await getDocs(wordsDocsQuery);

        const words: Word[] = [];

        const wordsCollection = collection(db, 'boards', boardId, 'words');

        for await (const wordDoc of wordsDocs.docs) {
            const wordId = wordDoc.data().wordId;
            const wordDocRef = doc(wordsCollection, wordId);
            const wordData = (await getDoc(wordDocRef)).data() as Word;

            const roots: { label: string, value: string }[] = [];
            const queryRoots = query(rootWordsCollection, where("wordId", "==", wordDoc.id));
            const rootWordsDocs = await getDocs(queryRoots);

            for await (const rootWordDoc of rootWordsDocs.docs) {
                const rootWordDocData = rootWordDoc.data()
                roots.push({ label: rootWordDocData.label, value: rootWordDocData.rootId });
            }

            const word = { ...wordData, roots, _id: wordDoc.id };
            words.push(word);
        }

        return words;
    } catch (error) {
        throw error;
    }
};

export default fetchWordsByRoot;
