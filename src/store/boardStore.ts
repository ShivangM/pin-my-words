import { Board, Metadata } from '@/interfaces/Board.d';
import { RootWord, Word } from '@/interfaces/Word';
import deleteBoardByBoardIdAndUserId from '@/lib/deleteBoardByBoardIdAndUserId';
import fetchBoardByUserEmailAndBoardId from '@/lib/fetchBoardByUserEmailAndBoardId';
import fetchRootWordsByBoardIdAndUserId from '@/lib/fetchRootWordsByBoardIdAndUserId';
import fetchWordsByBoardId from '@/lib/fetchWordsByBoardId';
import updateBoardByBoardIdAndUserId from '@/lib/updateBoardByBoardIdAndUserId';
import { toast } from 'react-toastify';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BoardState {
  board: null | Board;
  loading: boolean;
  words: null | Word[];
  rootWords: null | RootWord[]

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

  sidePanelOpen: boolean;
  openSidePanel: () => void;
  closeSidePanel: () => void;

  fetchBoard: (boardId: string, userEmail: string) => void;
  deleteBoard: (userId: string) => Promise<boolean>;
  editBoard: (userId: string, metadata: Metadata) => void;
}

const useBoardStore = create<BoardState>()(
  devtools((set, get) => ({
    board: null,
    loading: false,
    sidePanelOpen: false,
    words: null,
    rootWords: null,
    image: null,
    previewImage: null,

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

    fetchBoard: async (boardId, userEmail) => {
      set({ loading: true });
      const board = await fetchBoardByUserEmailAndBoardId(userEmail, boardId);
      const words = await fetchWordsByBoardId(boardId);
      set({ board, loading: false, words });
    },

    deleteBoard: async (userId) => {
      set({ loading: true });
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

      set({ loading: false });
      return success;
    },

    editBoard: async (userId, metadata) => {
      set({ loading: true });
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

      set({ loading: false, editBoardModalOpen: false });
    },
  }))
);

export default useBoardStore;
