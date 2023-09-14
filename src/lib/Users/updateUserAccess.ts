import db from "@/utils/firebase";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import fetchUserAccess from "./fetchUserAccess";
import { BoardAccess, BoardUser } from "@/interfaces/Board.d";

const updateUserAccess = async (
    user: BoardUser,
    userId: string,
    boardId: string,
    access: BoardAccess,
): Promise<void> => {

    try {
        const boardRef = doc(db, 'boards', boardId);
        const boardDoc = await getDoc(boardRef);

        if (!boardDoc.exists()) {
            throw new Error('Board does not exist');
        }

        const userAccess = await fetchUserAccess(boardId, userId);

        if (!userAccess || userAccess === BoardAccess.READ_ONLY || userAccess === BoardAccess.READ_WRITE) {
            throw new Error('User does not have access to update users on this board');
        }

        if (user.access === BoardAccess.OWNER) {
            throw new Error('User is the owner of the board and cannot be updated');
        }

        if (user.access === BoardAccess.ADMIN && userAccess !== BoardAccess.OWNER) {
            throw new Error('Admin cannot be updated by another admin');
        }

        await updateDoc(doc(db, 'users-boards', user.uid! + '_' + boardRef.id), {
            access,
            updatedAt: Timestamp.now(),
        });
    } catch (error) {
        throw error;
    }
}

export default updateUserAccess;