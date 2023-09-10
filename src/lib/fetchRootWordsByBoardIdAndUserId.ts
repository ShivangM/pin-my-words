import { RootWord } from "@/interfaces/Word";
import db from "@/utils/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import fetchUserAccessByBoardIdAndUserId from "./fetchUserAccessByBoardIdAndUserId";

const fetchRootWordsByBoardIdAndUserId = async (boardId: string, userId: string): Promise<RootWord[]> => {
    let rootWords: RootWord[] = []

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

        const rootWordsCollection = collection(db, boardRef.path + "/roots")

        const rootWordDocs = await getDocs(rootWordsCollection);

        rootWordDocs.forEach((doc) => {
            const docData = doc.data();
            rootWords.push({ ...docData, _id: doc.id } as RootWord)
        });
    } catch (error) {
        console.error(error);
    }

    console.log(rootWords)
    return rootWords
}

export default fetchRootWordsByBoardIdAndUserId;