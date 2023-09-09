import { Board, Metadata } from '@/interfaces/Board.d';
import { RootWord, Word } from '@/interfaces/Word';
import addWordToBoardUsingBoardIdAndUserId from '@/lib/addWordToBoardUsingBoardIdAndUserId';
import deleteBoardByBoardIdAndUserId from '@/lib/deleteBoardByBoardIdAndUserId';
import deleteWordFromBoard from '@/lib/deleteWordUsingFromBoard';
import fetchBoardByBoardIdAndUserId from '@/lib/fetchBoardByBoardIdAndUserId';
import fetchWordsByBoardIdAndUserId from '@/lib/fetchWordsByBoardIdAndUserId';
import updateBoardByBoardIdAndUserId from '@/lib/updateBoardByBoardIdAndUserId';
import { toast } from 'react-toastify';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BoardState {
  board: null | Board;
  words: null | Word[];
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

  addWordModalOpen: boolean;
  openAddWordModal: () => void;
  closeAddWordModal: () => void;
  addWord: (word: Word, boardId: string, userId: string, image?: File) => Promise<void>;

  deleteWordModalOpen: boolean;
  openDeleteWordModal: (word: Word) => void;
  closeDeleteWordModal: () => void;
  deleteWord: (userId: string) => Promise<void>;

  editWordModalOpen: boolean;
  openEditWordModal: (word: Word) => void;
  closeEditWordModal: () => void;
  editWord: (userId: string) => Promise<void>;

  sidePanelOpen: boolean;
  openSidePanel: () => void;
  closeSidePanel: () => void;

  fetchBoard: (boardId: string, userId: string) => void;
  deleteBoard: (userId: string) => Promise<boolean>;
  editBoard: (userId: string, metadata: Metadata) => void;
}

const useBoardStore = create<BoardState>()(
  devtools((set, get) => ({
    board: null,
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

    addWord: async (word, boardId, userId, image) => {
      toast.loading('Adding word...', {
        toastId: 'add-word',
      });
      const wordAdded = await addWordToBoardUsingBoardIdAndUserId(boardId, word, userId, image);

      if (wordAdded) {
        set({ addWordModalOpen: false, words: [wordAdded, ...get().words!] });
        toast.success('Word added successfully');
      }
      else {
        toast.error('Failed to add word');
      }
      toast.dismiss('add-word');
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
        await deleteWordFromBoard(get().board!._id, get().focusedWord._id, userId);
      } catch (error) {
        throw error;
      }
    },

    editWordModalOpen: false,
    openEditWordModal: (word) => {
      set({ deleteWordModalOpen: true, focusedWord: word });
    },

    closeEditWordModal: () => {
      set({ deleteWordModalOpen: false, focusedWord: null });
    },

    editWord: async (userId) => {
      if (!get().focusedWord) return;
      try {
        await editWordFromBoard(get().board!._id, get().focusedWord._id, userId);
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
      toast.loading('Deleting board...', {
        toastId: 'delete-board',
      });

      const boardId = get().board?._id;
      if (!boardId) {
        toast.dismiss('delete-board');
        toast.error('Failed to delete board');
        set({ loading: false });
        return false;
      }

      const success = await deleteBoardByBoardIdAndUserId(userId, boardId);
      toast.dismiss('delete-board');

      if (!success) {
        toast.error('Failed to delete board');
      } else {
        toast.success('Board deleted successfully');
      }

      return success;
    },

    editBoard: async (userId, metadata) => {
      toast.loading('Updating board...', {
        toastId: 'update-board',
      });

      const boardId = get().board?._id;
      const image = get().image;

      if (!boardId) {
        toast.dismiss('delete-board');
        toast.error('Failed to delete board');
        set({ loading: false });
        return false;
      }

      const updatedBoard = await updateBoardByBoardIdAndUserId(
        userId,
        boardId,
        metadata,
        image
      );

      toast.dismiss('update-board');

      if (!updatedBoard) {
        toast.error('Failed to update board');
      } else {
        toast.success('Board updated successfully');
      }

      set({ editBoardModalOpen: false });
    },
  }))
);

export default useBoardStore;
