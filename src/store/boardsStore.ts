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
  fetchBoards: (email: string) => void;
  boards: null | Board[];
  loading: boolean;

  metadata: Metadata | null;

  users: CollaborativeUser[] | [];
  addUser: (user: CollaborativeUser) => void;
  removeUser: (userEmail: string) => void;

  image: File | null;
  previewImage: string | null;
  setImage: (image: File) => void;

  createBoardModalOpen: boolean;
  createBoardStep: CreateBoardSteps;
  setBoardStep: (step: CreateBoardSteps) => void;
  openCreateBoardModal: () => void;
  closeCreateBoardModal: () => void;
  createBoard: (user: User) => void;
  setMetadata: (metadata: Metadata) => void;
}

const useBoardsStore = create<BoardsState>()(
  devtools((set, get) => ({
    boards: null,
    image: null,
    previewImage: null,
    createBoardStep: CreateBoardSteps.ENTER_DETAILS,
    users: [],
    metadata: null,
    loading: false,

    //Create Board Modal
    createBoardModalOpen: false,
    closeCreateBoardModal: () => set({ createBoardModalOpen: false }),
    openCreateBoardModal: () => set({ createBoardModalOpen: true }),
    setBoardStep: (step) => set({ createBoardStep: step }),

    // Set Board Metadata
    setMetadata: (metadata) =>
      set({ metadata, createBoardStep: CreateBoardSteps.INVITE_USERS }),

    // Set Board Image
    setImage: (image) =>
      set({ image, previewImage: URL.createObjectURL(image) }),

    // Fetch Boards
    fetchBoards: async (email: string) => {
      toast.loading('Loading your boards...', {
        toastId: 'fetching-boards',
      });

      const boards = await fetchBoardsByEmail(email);
      set({ boards });
      toast.dismiss('fetching-boards');
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

    createBoard: async (user) => {
      let board = {
        metadata: get().metadata,
        owner: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      set({ loading: true });

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
        access: BoardAccess.OWNER,
      });

      //Upload Image to Storage
      const image = get().image;
      let imageDownloadURL: string | null = null;

      if (image) {
        const imageRef = ref(storage, 'boards/' + boardRef.id);
        const imageBlob = new Blob([image], { type: 'image/jpeg' });

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

      const newBoard: Board = {
        _id: boardRef.id,
        metadata: {
          ...get().metadata!,
          image: get().previewImage!,
        },
        owner: user,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      set({
        loading: false,
        createBoardModalOpen: false,
        boards: [newBoard, ...get().boards!],
      });
      toast.dismiss('creating-board');
      return true;
    },
  }))
);

export default useBoardsStore;
