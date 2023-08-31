import { Board } from '@/interfaces/Board.d';
import fetchBoardByUserEmailAndBoardId from '@/lib/fetchBoardByUserEmailAndBoardId';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BoardState {
  board: null | Board;
  loading: boolean;
  sidePanelOpen: boolean;
  openSidePanel: () => void;
  closeSidePanel: () => void;
  fetchBoard: (boardId: string, userEmail: string) => void;
}

const useBoardStore = create<BoardState>()(
  devtools((set) => ({
    board: null,
    loading: false,
    sidePanelOpen: false,
    openSidePanel: () => {
      set({ sidePanelOpen: true });
    },
    closeSidePanel: () => {
      set({ sidePanelOpen: false });
    },
    fetchBoard: async (boardId, userEmail) => {
      set({ loading: true });
      const board = await fetchBoardByUserEmailAndBoardId(userEmail, boardId);
      set({ board, loading: false });
    },
  }))
);

export default useBoardStore;
