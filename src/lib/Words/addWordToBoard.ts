import { Word } from "@/interfaces/Word";
import db, { storage } from "@/utils/firebase";
import { Timestamp, addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
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

        const wordsCollection = collection(db, boardRef.path, "words");
        const wordExistQuery = query(wordsCollection, where('word', '==', word.word.toLowerCase()));
        const wordExistDoc = await getDocs(wordExistQuery);

        if (!wordExistDoc.empty) {
            throw new Error('Word already exists');
        }

        const roots = word.roots;
        delete word.roots;

        const wordDoc = await addDoc(wordsCollection, {
            ...word,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            createdBy: userId,
        });

        if (roots) {
            const rootWordsCollection = collection(db, boardRef.path, "roots-words");

            for await (const root of roots) {
                await setDoc(doc(rootWordsCollection, root.value + "_" + wordDoc.id), {
                    rootId: root.value,
                    wordId: wordDoc.id,
                    label: root.label,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                });
            }
        }

        let imageUrl = undefined;

        if (image) {
            const storageRef = ref(storage, `boards/${boardId}/words/${wordDoc.id}`);
            await uploadBytes(storageRef, image);
            imageUrl = await getDownloadURL(storageRef);
            await updateDoc(wordDoc, { image: imageUrl });
        }

        const wordAdded = {
            ...word,
            _id: wordDoc.id,
            roots,
            image: imageUrl,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            createdBy: userId,
        };

        return wordAdded;
    } catch (error) {
        throw error;
    }
}

export default addWordToBoard;