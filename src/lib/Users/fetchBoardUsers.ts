import { BoardAccess, BoardUser } from "@/interfaces/Board";
import db from "@/utils/firebase";
import { collection, doc, getDoc, getDocs, limit, query, where } from "firebase/firestore";
import fetchUserAccess from "./fetchUserAccess";
import fetchUser from "./fetchUser";

const fetchBoardUsers = async (boardId: string, userId: string): Promise<BoardUser[]> => {
    try {
        const boardRef = doc(db, 'boards', boardId);
        const boardDoc = await getDoc(boardRef);

        if (!boardDoc.exists()) {
            throw new Error('Board does not exist');
        }

        const userAccess = await fetchUserAccess(boardId, userId);

        if (!userAccess) {
            throw new Error('User does not have access to this board');
        }

        const boardUsersCollection = collection(db, 'users-boards');
        const boardUsersQuery = query(boardUsersCollection, where('boardId', '==', boardId), limit(100));

        const userDocs = await getDocs(boardUsersQuery);
        let userResults: BoardUser[] = [];

        for await (const userDoc of userDocs.docs) {
            const docData = userDoc.data();
            const access = docData.access as BoardAccess;
            const user = await fetchUser(docData.userId);
            userResults.push({ access, ...user });
        }

        return userResults;
    } catch (error) {
        throw error;
    }
}

export default fetchBoardUsers;