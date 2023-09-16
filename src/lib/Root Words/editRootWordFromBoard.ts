import { RootWord } from "@/interfaces/Word.d";
import db from "@/utils/firebase";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import fetchUserAccess from "../Users/fetchUserAccess";
import { BoardAccess } from "@/interfaces/Board.d";

const editRootWordFromBoard = async (
    rootWord: RootWord,
    boardId: string,
    userId: string,
): Promise<RootWord> => {
    try {
        const userAccess = await fetchUserAccess(boardId, userId);

        if (!userAccess || userAccess === BoardAccess.READ_ONLY) {
            throw new Error('User does not have write access to this board');
        }

        const boardRef = doc(db, 'boards', boardId);
        const rootWordRef = doc(db, boardRef.path, "roots", rootWord._id);
        const rootWordDoc = await getDoc(rootWordRef);

        if (!rootWordDoc.exists()) {
            throw new Error('Root Word does not exist');
        }

        await updateDoc(rootWordRef, { ...rootWord, updatedAt: Timestamp.now() });

        const rootWordUpdated = {
            ...rootWord,
            updatedAt: Timestamp.now(),
        };

        return rootWordUpdated;
    } catch (error) {
        throw error;
    }
}

export default editRootWordFromBoard;