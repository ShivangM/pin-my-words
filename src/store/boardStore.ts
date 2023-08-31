import { Board } from '@/interfaces/Board.d';
import { Word } from '@/interfaces/Word';
import fetchBoardByUserEmailAndBoardId from '@/lib/fetchBoardByUserEmailAndBoardId';
import fetchWordsByBoardId from '@/lib/fetchWordsByBoardId';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BoardState {
  board: null | Board;
  loading: boolean;
  sidePanelOpen: boolean;
  words: null | Word[];
  openSidePanel: () => void;
  closeSidePanel: () => void;
  fetchBoard: (boardId: string, userEmail: string) => void;
}

const useBoardStore = create<BoardState>()(
  devtools((set) => ({
    board: null,
    loading: false,
    sidePanelOpen: false,
    words: null,

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
  }))
);

export default useBoardStore;
