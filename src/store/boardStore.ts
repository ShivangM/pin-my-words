import { Board, BoardAccess, Metadata } from '@/interfaces/Board.d';
import { RootWord, Word } from '@/interfaces/Word.d';
import addWordToBoardUsingBoardIdAndUserId from '@/lib/addWordToBoardUsingBoardIdAndUserId';
import deleteBoardByBoardIdAndUserId from '@/lib/deleteBoardByBoardIdAndUserId';
import deleteWordFromBoard from '@/lib/deleteWordFromBoard';
import editWordFromBoard from '@/lib/editWordFromBoard';
import fetchBoardByBoardIdAndUserId from '@/lib/fetchBoardByBoardIdAndUserId';
import fetchUserAccessByBoardIdAndUserId from '@/lib/fetchUserAccessByBoardIdAndUserId';
import fetchWordsByBoardIdAndUserId from '@/lib/fetchWordsByBoardIdAndUserId';
import updateBoardByBoardIdAndUserId from '@/lib/updateBoardByBoardIdAndUserId';
import { toast } from 'react-toastify';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BoardState {
  board: null | Board;
  words: null | Word[];
  userAccess: null | BoardAccess;
  rootWords: null | RootWord[]
  focusedWord: Word | null;

  deleteBoardModalOpen: boolean;
  openDeleteBoardModal: () => void;
  closeDeleteBoardModal: () => void;

  editBoardModalOpen: boolean;
  openEditBoardModal: () => void;
  closeEditBoardModal: () => void;
  image: File | null;
  previewImage: string | null;
  setImage: (image: File) => void;

  fetchUserAccess: (boardId: string, userId: string) => Promise<void>;
  fetchWords: (boardId: string, userId: string) => Promise<void>;

  addWordModalOpen: boolean;
  openAddWordModal: () => void;
  closeAddWordModal: () => void;
  addWord: (word: Word, userId: string, image?: File) => Promise<void>;

  deleteWordModalOpen: boolean;
  openDeleteWordModal: (word: Word) => void;
  closeDeleteWordModal: () => void;
  deleteWord: (userId: string) => Promise<void>;

  editWordModalOpen: boolean;
  openEditWordModal: (word: Word) => void;
  closeEditWordModal: () => void;
  editWord: (word: Word, userId: string, image?: File) => Promise<void>;

  sidePanelOpen: boolean;
  openSidePanel: () => void;
  closeSidePanel: () => void;

  fetchBoard: (boardId: string, userId: string) => void;
  deleteBoard: (userId: string) => Promise<void>;
  editBoard: (userId: string, metadata: Metadata) => Promise<void>;

  reset: () => void;
}

const useBoardStore = create<BoardState>()(
  devtools((set, get) => ({
    board: null,
    userAccess: null,
    sidePanelOpen: false,
    words: null,
    rootWords: null,
    image: null,
    previewImage: null,
    focusedWord: null,

    setImage: (image) => {
      set({ image, previewImage: URL.createObjectURL(image) });
    },

    deleteBoardModalOpen: false,
    openDeleteBoardModal: () => {
      set({ deleteBoardModalOpen: true });
    },

    closeDeleteBoardModal: () => {
      set({ deleteBoardModalOpen: false });
    },

    addWordModalOpen: false,
    openAddWordModal: () => {
      set({ addWordModalOpen: true });
    },

    closeAddWordModal: () => {
      set({ addWordModalOpen: false });
    },

    addWord: async (word, userId, image) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      try {
        const wordAdded = await addWordToBoardUsingBoardIdAndUserId(boardId, word, userId, image);
        set({ addWordModalOpen: false, words: [wordAdded, ...get().words!] });
      } catch (error) {
        throw error;
      }
    },

    deleteWordModalOpen: false,
    openDeleteWordModal: (word) => {
      set({ deleteWordModalOpen: true, focusedWord: word });
    },

    closeDeleteWordModal: () => {
      set({ deleteWordModalOpen: false, focusedWord: null });
    },

    deleteWord: async (userId) => {
      if (!get().focusedWord) return;
      try {
        await deleteWordFromBoard(get().board!._id, get().focusedWord!._id, userId);
        set({
          deleteWordModalOpen: false,
          focusedWord: null,
          words: get().words?.filter((word) => word._id !== get().focusedWord!._id),
        });
      } catch (error) {
        throw error;
      }
    },

    editWordModalOpen: false,
    openEditWordModal: (word) => {
      set({ editWordModalOpen: true, focusedWord: word });
    },

    closeEditWordModal: () => {
      set({ editWordModalOpen: false, focusedWord: null });
    },

    editWord: async (word, userId, image) => {
      const boardId = get().board?._id;

      if (!boardId) {
        throw new Error('Board does not exist');
      }

      try {
        const editedWord = await editWordFromBoard(word, boardId, userId, image);
        set({
          editWordModalOpen: false,
          focusedWord: null,
          words: get().words?.map((word) => {
            if (word._id === editedWord._id) {
              return editedWord;
            }
            return word;
          }),
        });
      } catch (error) {
        throw error;
      }
    },

    editBoardModalOpen: false,
    openEditBoardModal: () => {
      set({ editBoardModalOpen: true });
    },

    closeEditBoardModal: () => {
      set({ editBoardModalOpen: false });
    },

    openSidePanel: () => {
      set({ sidePanelOpen: true });
    },

    closeSidePanel: () => {
      set({ sidePanelOpen: false });
    },

    fetchUserAccess: async (boardId, userId) => {
      try {
        const userAccess = await fetchUserAccessByBoardIdAndUserId(boardId, userId);
        set({ userAccess });
      } catch (error) {
        throw error;
      }
    },

    fetchBoard: async (boardId, userId) => {
      try {
        const board = await fetchBoardByBoardIdAndUserId(boardId, userId);
        set({ board });
      } catch (error) {
        throw error;
      }
    },

    fetchWords: async (boardId, userId) => {
      try {
        const words = await fetchWordsByBoardIdAndUserId(boardId, userId);
        set({ words });
      } catch (error) {
        throw error;
      }
    },

    deleteBoard: async (userId) => {
      const boardId = get().board?._id;
      if (!boardId) {
        throw new Error('Board does not exist');
      }

      try {
        await deleteBoardByBoardIdAndUserId(userId, boardId);
      } catch (error) {
        throw error;
      }
    },

    editBoard: async (userId, metadata) => {
      const boardId = get().board?._id;
      const image = get().image;

      if (!boardId) {
        throw new Error('Board does not exist');
      }

      try {
        const updatedBoard = await updateBoardByBoardIdAndUserId(
          userId,
          boardId,
          metadata,
          image
        );

        set({ board: updatedBoard });
      } catch (error) {
        throw error;
      }
    },

    reset: () => {
      set({
        board: null,
        userAccess: null,
        sidePanelOpen: false,
        words: null,
        image: null,
        previewImage: null,
        focusedWord: null,
      });
    }
  }))
);

export default useBoardStore;
