import { RootWord } from "@/interfaces/Word";
import db from "@/utils/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

const fetchRootWordsByBoardIdAndUserId = async (boardId: string, userId: string): Promise<RootWord[]> => {
    let rootWords: RootWord[] = []

    try {
        const boardRef = doc(db, 'boards', boardId);
        const boardDoc = await getDoc(boardRef);

        if (!boardDoc.exists()) {
            throw new Error('Board does not exist');
        }

        const rootWordsCollection = collection(db, boardRef.path + "/roots")        

        const rootWordDocs = await getDocs(rootWordsCollection);

        rootWordDocs.forEach((doc) => {
            const docData = doc.data();
            rootWords.push(docData as RootWord)
        });
    } catch (error) {
        console.error(error);
    }

    console.log(rootWords)
    return rootWords
}

export default fetchRootWordsByBoardIdAndUserId;