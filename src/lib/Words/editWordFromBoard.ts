import { Word } from "@/interfaces/Word.d";
import db, { storage } from "@/utils/firebase";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import fetchUserAccess from "../Users/fetchUserAccess";
import { BoardAccess } from "@/interfaces/Board.d";

const editWordFromBoard = async (
    word: Word,
    boardId: string,
    userId: string,
    image?: File,
): Promise<Word> => {
    try {
        const userAccess = await fetchUserAccess(boardId, userId);

        if (!userAccess || userAccess === BoardAccess.READ_ONLY) {
            throw new Error('User does not have write access to this board');
        }

        const wordRef = doc(db, 'boards', boardId, "words", word._id);
        const wordDoc = await getDoc(wordRef);

        if (!wordDoc.exists()) {
            throw new Error('Word does not exist');
        }

        await updateDoc(wordRef, { ...word, updatedAt: Timestamp.now() });

        if (image) {
            const storageRef = ref(storage, `boards/${boardId}/words/${word._id}`);
            await uploadBytes(storageRef, image);
            const imageUrl = await getDownloadURL(storageRef);
            await updateDoc(wordRef, { image: imageUrl, updatedAt: Timestamp.now() });
        }

        const wordUpdated = {
            ...word,
            image: image ? URL.createObjectURL(image) : undefined,
            updatedAt: Timestamp.now(),
        };

        return wordUpdated;
    } catch (error) {
        throw error;
    }
}

export default editWordFromBoard;