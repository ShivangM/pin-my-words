import {
  Board,
  CollaborativeUser,
  CreateBoardSteps,
  Metadata,
} from '@/interfaces/Board.d';
import fetchBoardsByUid from '@/lib/fetchBoardsByUid';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { toast } from 'react-toastify';
import { User } from '@/interfaces/User';
import createBoardUsingUserId from '@/lib/createBoardUsingUserId';

interface BoardsState {
  fetchBoards: (email: string) => Promise<void>;
  boards: null | Board[];

  users: CollaborativeUser[] | null;
  addUser: (user: CollaborativeUser) => void;
  removeUser: (userUid: string) => void;

  metadata: Metadata | null;
  setMetadata: (metadata: Metadata) => void;

  image: File | null;
  previewImage: string | null;
  setImage: (image: File) => void;

  createBoardModalOpen: boolean;
  openCreateBoardModal: () => void;
  closeCreateBoardModal: () => void;

  createBoardStep: CreateBoardSteps;
  setBoardStep: (step: CreateBoardSteps) => void;

  createBoard: (user: User) => Promise<void>;
}

const useBoardsStore = create<BoardsState>()(
  devtools((set, get) => ({
    boards: null,
    image: null,
    previewImage: null,
    createBoardStep: CreateBoardSteps.ENTER_DETAILS,
    users: [],
    metadata: null,

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
    fetchBoards: async (uid: string) => {
      const boards = await fetchBoardsByUid(uid);
      set({ boards });
      toast.dismiss('fetching-boards');
    },

    addUser: (user) => {
      const users = get().users;
      set({
        users: users ? [...users, user] : [user],
      });
    },

    removeUser: (userUid) => {
      set((state) => ({
        users: state.users!.filter((user) => user.user.uid !== userUid),
      }));
    },

    createBoard: async (user) => {
      try {
        const newBoard = await createBoardUsingUserId(get().metadata!, user.uid!, get().image, get().users);

        set({
          createBoardModalOpen: false,
          boards: [newBoard, ...get().boards!],
        });
      } catch (error) {
        throw error;
      }
    },
  }))
);

export default useBoardsStore;
