import db from "@/utils/firebase";
import { Timestamp, addDoc, collection, doc, getDoc } from "firebase/firestore";
import fetchUserAccess from "../Users/fetchUserAccess";
import { BoardAccess } from "@/interfaces/Board.d";
import { Notification, NotificationType } from "@/interfaces/Notification.d";

const addNotificationToBoard = async (
    boardId: string,
    userId: string,
    notification: Notification,
): Promise<Notification> => {

    try {
        const boardRef = doc(db, 'boards', boardId);
        const boardDoc = await getDoc(boardRef);

        if (!boardDoc.exists()) {
            throw new Error('Board does not exist');
        }

        const userAccess = await fetchUserAccess(boardId, userId);

        if ((!userAccess || userAccess === BoardAccess.READ_ONLY) && (notification.type !== NotificationType.USER_LEFT)) {
            throw new Error('User does not have write access to this board');
        }

        const notificationsCollection = collection(db, boardRef.path, "notifications");

        const notificationDoc = await addDoc(notificationsCollection, {
            ...notification,
            createdAt: Timestamp.now(),
            createdBy: userId,
        });

        const notificationAdded = {
            ...notification,
            _id: notificationDoc.id,
            createdAt: Timestamp.now(),
            createdBy: userId,
        };

        return notificationAdded;
    } catch (error) {
        throw error;
    }
}

export default addNotificationToBoard;