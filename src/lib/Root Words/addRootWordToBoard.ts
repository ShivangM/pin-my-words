import { RootWord } from "@/interfaces/Word.d";
import db from "@/utils/firebase";
import { Timestamp, addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import fetchUserAccess from "../Users/fetchUserAccess";
import { BoardAccess } from "@/interfaces/Board.d";

const addRootWordToBoard = async (
    boardId: string,
    rootWord: RootWord,
    userId: string,
): Promise<RootWord> => {

    try {
        const boardRef = doc(db, 'boards', boardId);
        const boardDoc = await getDoc(boardRef);

        if (!boardDoc.exists()) {
            throw new Error('Board does not exist');
        }

        const userAccess = await fetchUserAccess(boardId, userId);

        if (!userAccess || userAccess === BoardAccess.READ_ONLY) {
            throw new Error('User does not have write access to this board');
        }

        const rootWordRef = collection(db, boardRef.path + "/roots");
        const rootWordDoc = await addDoc(rootWordRef, rootWord);

        const rootWordAdded = {
            ...rootWord,
            _id: rootWordDoc.id,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        return rootWordAdded;
    } catch (error) {
        throw error;
    }
}

export default addRootWordToBoard;