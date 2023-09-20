import { Word } from '@/interfaces/Word.d';
import db, { storage } from '@/utils/firebase';
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  deleteDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import fetchUserAccess from '../Users/fetchUserAccess';
import { BoardAccess } from '@/interfaces/Board.d';

const editWordFromBoard = async (
  word: Word,
  boardId: string,
  userId: string,
  image?: File
): Promise<Word> => {
  try {
    const userAccess = await fetchUserAccess(boardId, userId);

    if (!userAccess || userAccess === BoardAccess.READ_ONLY) {
      throw new Error('User does not have write access to this board');
    }

    const boardRef = doc(db, 'boards', boardId);
    const wordRef = doc(db, boardRef.path, 'words', word._id);
    const wordDoc = await getDoc(wordRef);

    if (!wordDoc.exists()) {
      throw new Error('Word does not exist');
    }

    const roots = word.roots;
    delete word.roots;

    await updateDoc(wordRef, { ...word, updatedAt: Timestamp.now() });

    if (roots) {
      const rootWordsCollection = collection(db, boardRef.path, 'roots-words');

      const rootWordsQuery = query(
        rootWordsCollection,
        where('wordId', '==', word._id)
      );
      const rootWordsDocs = await getDocs(rootWordsQuery);

      // Delete root words that are not in the new list
      for await (const rootWordDoc of rootWordsDocs.docs) {
        const rootWord = rootWordDoc.data();
        if (!roots.find((root) => root.value === rootWord.rootId)) {
          deleteDoc(doc(rootWordsCollection, rootWordDoc.id));
        }
      }

      // Add new root words
      for await (const root of roots) {
        await setDoc(doc(rootWordsCollection, root.value + '_' + wordDoc.id), {
          rootId: root.value,
          wordId: wordDoc.id,
          label: root.label,
        });
      }
    }

    let imageUrl = word.image;

    if (image) {
      const storageRef = ref(storage, `boards/${boardId}/words/${word._id}`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
      await updateDoc(wordRef, { image: imageUrl, updatedAt: Timestamp.now() });
    }

    const wordUpdated = {
      ...word,
      roots,
      image: imageUrl,
      updatedAt: Timestamp.now(),
    };

    return wordUpdated;
  } catch (error) {
    throw error;
  }
};

export default editWordFromBoard;
