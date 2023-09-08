import { Word } from "@/interfaces/Word";
import db, { storage } from "@/utils/firebase";
import { Timestamp, addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const addWordToBoardUsingBoardIdAndUserId = async (
    boardId: string,
    word: Word,
    image?: File,
    userId?: string,
): Promise<boolean> => {
    try {
        const boardRef = doc(db, 'boards', boardId);
        const boardDoc = await getDoc(boardRef);

        if (!boardDoc.exists()) {
            throw new Error('Board does not exist');
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

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export default addWordToBoardUsingBoardIdAndUserId;