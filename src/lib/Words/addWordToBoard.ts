import { Word } from "@/interfaces/Word";
import db, { storage } from "@/utils/firebase";
import { Timestamp, addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import fetchUserAccess from "../Users/fetchUserAccess";
import { BoardAccess } from "@/interfaces/Board.d";

const addWordToBoard = async (
    boardId: string,
    word: Word,
    userId: string,
    image?: File,
): Promise<Word> => {

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

        const wordRef = collection(db, boardRef.path + "/words");
        const wordDoc = await addDoc(wordRef, word);

        const rootWordsRef = collection(db, boardRef.path + "/roots-words");
        const rootWordDoc = await addDoc(rootWordsRef, {
            wordId: wordDoc.id,
            rootId: word.roots,
        });

        if (image) {
            const storageRef = ref(storage, `boards/${boardId}/words/${wordDoc.id}`);
            await uploadBytes(storageRef, image);
            const imageUrl = await getDownloadURL(storageRef);
            await updateDoc(wordDoc, { image: imageUrl });
        }

        const wordAdded = {
            ...word,
            _id: wordDoc.id,
            image: image ? URL.createObjectURL(image) : undefined,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        return wordAdded;
    } catch (error) {
        throw error;
    }
}

export default addWordToBoard;