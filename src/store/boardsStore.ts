import {
  Board,
  BoardAccess,
  CollaborativeUser,
  CreateBoardSteps,
  Metadata,
} from '@/interfaces/Board.d';
import fetchBoardsByEmail from '@/lib/fetchBoardsByEmail';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { toast } from 'react-toastify';
import { User } from '@/interfaces/User';
import {
  addDoc,
  collection,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import db, { storage } from '@/utils/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

interface BoardsState {
  boards: null | Board[];
  users: CollaborativeUser[] | [];
  createBoardStep: CreateBoardSteps;
  metadata: Metadata | null;
  image: File | null;
  previewImage: string | null;
  fetchBoards: (email: string) => void;
  createBoard: (user: User) => void;
  addUser: (user: CollaborativeUser) => void;
  removeUser: (userEmail: string) => void;
  setImage: (image: File) => void;
  setBoardStep: (step: CreateBoardSteps) => void;
  setMetadata: (metadata: Metadata) => void;
}

const useBoardsStore = create<BoardsState>()(
  devtools((set, get) => ({
    boards: null,
    users: [],
    createBoardStep: CreateBoardSteps.ENTER_DETAILS,
    metadata: null,
    image: null,
    previewImage: null,

    setMetadata: (metadata) => {
      set({ metadata });
    },

    fetchBoards: async (email: string) => {
      toast.loading('Fetching boards...', {
        toastId: 'fetching-boards',
      });
      const boards = await fetchBoardsByEmail(email);
      set({ boards });
      toast.dismiss('fetching-boards');
    },

    setBoardStep: (step) => {
      set({ createBoardStep: step });
    },

    addUser: (user) => {
      const users = get().users;
      set({
        users: [...users, user],
      });
    },

    removeUser: (userEmail) => {
      set((state) => ({
        users: state.users!.filter((user) => user.email !== userEmail),
      }));
    },

    setImage: (image) => {
      set({
        image,
        previewImage: URL.createObjectURL(image),
      });
    },

    createBoard: async (user) => {
      let board = {
        metadata: get().metadata,
        owner: user,
        createdAt: Timestamp.now(),
      };

      toast.loading('Creating board...', {
        toastId: 'creating-board',
      });

      const boardsCollection = collection(db, 'boards');
      const boardRef = await addDoc(boardsCollection, board);

      const users = get().users;
      // const usersBoardsCollection = collection(db, 'users-boards');
      users.forEach((user) => {
        setDoc(doc(db, 'users-boards', user.email + '_' + boardRef.id), {
          boardId: boardRef.id,
          userId: user.email,
          access: user.access,
        });
      });

      setDoc(doc(db, 'users-boards', user.email + '_' + boardRef.id), {
        boardId: boardRef.id,
        userId: user.email,
        access: BoardAccess.ADMIN,
      });

      if (get().image) {
        const imageRef = ref(
          storage,
          'boards/' + boardRef.id + get().image!.name.split('.')[1]
        );
        const imageBlob = new Blob([get().image!], { type: 'image/jpeg' });

        await uploadBytes(imageRef, imageBlob, {
          contentType: 'image/jpeg',
        }).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            updateDoc(boardRef, {
              metadata: {
                ...get().metadata,
                image: downloadURL,
              },
            });
          });
        });
      }

      toast.dismiss('creating-board');
    },
  }))
);

export default useBoardsStore;
