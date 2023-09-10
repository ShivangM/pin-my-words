import db from "@/utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import fetchUserAccess from "./fetchUserAccess";
import { BoardAccess, BoardUser } from "@/interfaces/Board.d";

const addUserToBoard = async (
    boardId: string,
    user: BoardUser,
    userId: string,
): Promise<void> => {

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


        await setDoc(doc(db, 'users-boards', user.uid! + '_' + boardRef.id), {
            boardId: boardRef.id,
            userId: user.uid!,
            access: user.access,
        });
    } catch (error) {
        throw error;
    }
}

export default addUserToBoard;