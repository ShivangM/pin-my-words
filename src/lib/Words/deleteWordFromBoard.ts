import { BoardAccess } from "@/interfaces/Board.d";
import fetchUserAccess from "../Users/fetchUserAccess";
import db, { storage } from "@/utils/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const deleteWordFromBoard = async (boardId: string, wordId: string, userId: string): Promise<void> => {
    try {
        const userAccess = await fetchUserAccess(boardId, userId);

        if (userAccess === BoardAccess.READ_ONLY) {
            throw new Error('You do not have permission to edit this board');
        }

        const wordRef = doc(db, "boards", boardId, 'words', wordId);
        const wordDoc = await getDoc(wordRef);

        if (!wordDoc.exists()) {
            throw new Error('Word does not exist');
        }

        const word = wordDoc.data();

        const rootsWordsCollection = collection(db, "boards", boardId, 'roots-words');
        const q = query(rootsWordsCollection, where("wordId", "==", wordId));
        const queryDocs = await getDocs(q)

        const deletePromises: Promise<void>[] = [];

        queryDocs.forEach((doc) => {
            const deletePromise = deleteDoc(doc.ref);
            deletePromises.push(deletePromise);
        });

        // Wait for all promises to complete before returning
        await Promise.all(deletePromises);
        await deleteDoc(wordRef);

        //Deleting images from storage if existed
        if (word.image) {
            const imageRef = ref(storage, 'boards/' + boardId + "/words/" + wordId);
            await deleteObject(imageRef);
        }
    } catch (error) {
        throw error;
    }
}

export default deleteWordFromBoard;