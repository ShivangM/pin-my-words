import { Board, BoardAccess, BoardUser, Metadata } from '@/interfaces/Board.d';
import { RootWord, Word } from '@/interfaces/Word.d';
import addRootWordToBoard from '@/lib/Root Words/addRootWordToBoard';
import addWordToBoard from '@/lib/Words/addWordToBoard';
import deleteBoardHelper from '@/lib/Boards/deleteBoard';
import deleteWordFromBoard from '@/lib/Words/deleteWordFromBoard';
import editWordFromBoard from '@/lib/Words/editWordFromBoard';
import fetchBoardHelper from '@/lib/Boards/fetchBoard';
import fetchRootWordsHelper from '@/lib/Root Words/fetchRootWords';
import fetchUserAccessHelper from '@/lib/Users/fetchUserAccess';
import fetchWordsHelper from '@/lib/Words/fetchWords';
import updateBoard from '@/lib/Boards/updateBoard';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import addUserToBoard from '@/lib/Users/addUserToBoard';
import fetchBoardUsers from '@/lib/Users/fetchBoardUsers';

interface BoardState {
  board: null | Board;
  words: null | Word[];
  userAccess: null | BoardAccess;
  rootWords: null | RootWord[]
  focusedWord: Word | null;
  users: null | BoardUser[];

  deleteBoardModalOpen: boolean;
  openDeleteBoardModal: () => void;
  closeDeleteBoardModal: () => void;
  deleteBoard: (userId: string) => Promise<void>;

  editBoardModalOpen: boolean;
  openEditBoardModal: () => void;
  closeEditBoardModal: () => void;
  editBoard: (userId: string, metadata: Metadata, image?: File) => Promise<void>;

  fetchUserAccess: (boardId: string, userId: string) => Promise<void>;
  fetchWords: (boardId: string, userId: string) => Promise<void>;
  fetchRootWords: (boardId: string, userId: string) => Promise<void>;
  fetchUsers: (userId: string) => Promise<void>;

  addUserModalOpen: boolean;
  openAddUserModal: () => void;
  closeAddUserModal: () => void;
  addUser: (user: BoardUser, userId: string) => Promise<void>;

  addWordModalOpen: boolean;
  openAddWordModal: () => void;
  closeAddWordModal: () => void;
  addWord: (word: Word, userId: string, image?: File) => Promise<void>;

  addRootWordModalOpen: boolean;
  openAddRootWordModal: () => void;
  closeAddRootWordModal: () => void;
  addRootWord: (word: RootWord, userId: string) => Promise<void>;

  deleteWordModalOpen: boolean;
  openDeleteWordModal: (word: Word) => void;
  closeDeleteWordModal: () => void;
  deleteWord: (userId: string) => Promise<void>;

  editWordModalOpen: boolean;
  openEditWordModal: (word: Word) => void;
  closeEditWordModal: () => void;
  editWord: (word: Word, userId: string, image?: File) => Promise<void>;

  viewWordModalOpen: boolean;
  openViewWordModal: (word: Word) => void;
  closeViewWordModal: () => void;

  sidePanelOpen: boolean;
  openSidePanel: () => void;
  closeSidePanel: () => void;

  fetchBoard: (boardId: string, userId: string) => void;
  reset: () => void;
}

const useBoardStore = create<BoardState>()(
  devtools((set, get) => ({
    board: null,
    userAccess: null,
    words: null,
    rootWords: null,
    focusedWord: null,
    users: null,

    //Side Panel
    sidePanelOpen: false,
    openSidePanel: () => set({ sidePanelOpen: true }),
    closeSidePanel: () => set({ sidePanelOpen: false }),

    //Delete Board Modal
    deleteBoardModalOpen: false,
    openDeleteBoardModal: () => set({ deleteBoardModalOpen: true }),
    closeDeleteBoardModal: () => set({ deleteBoardModalOpen: false }),

    deleteBoard: async (userId) => {
      const boardId = get().board?._id;
      if (!boardId) {
        throw new Error('Board does not exist');
      }

      try {
        await deleteBoardHelper(userId, boardId);
      } catch (error) {
        throw error;
      }
    },

    //Add User Modal
    addUserModalOpen: false,
    openAddUserModal: () => set({ addUserModalOpen: true }),
    closeAddUserModal: () => set({ addUserModalOpen: false }),

    addUser: async (user, userId) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      try {
        const userAdded = await addUserToBoard(boardId, user, userId);
        set({ addUserModalOpen: false, users: [userAdded, ...get().users!] });
      } catch (error) {
        throw error;
      }
    },

    //Add Word Modal
    addWordModalOpen: false,
    openAddWordModal: () => set({ addWordModalOpen: true }),
    closeAddWordModal: () => set({ addWordModalOpen: false }),

    addWord: async (word, userId, image) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      try {
        const wordAdded = await addWordToBoard(boardId, word, userId, image);
        set({ addWordModalOpen: false, words: [wordAdded, ...get().words!] });
      } catch (error) {
        throw error;
      }
    },

    //Add Root Word Modal
    addRootWordModalOpen: false,
    openAddRootWordModal: () => set({ addRootWordModalOpen: true }),
    closeAddRootWordModal: () => set({ addRootWordModalOpen: false }),

    addRootWord: async (rootWord, userId) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      try {
        const rootWordAdded = await addRootWordToBoard(boardId, rootWord, userId);
        set({ addRootWordModalOpen: false, rootWords: [rootWordAdded, ...get().rootWords!] });
      } catch (error) {
        throw error;
      }
    },

    //Delete Word Modal
    deleteWordModalOpen: false,
    openDeleteWordModal: (word) => set({ deleteWordModalOpen: true, focusedWord: word }),
    closeDeleteWordModal: () => set({ deleteWordModalOpen: false, focusedWord: null }),

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

    //Edit Word Modal
    editWordModalOpen: false,
    openEditWordModal: (word) => set({ editWordModalOpen: true, focusedWord: word }),
    closeEditWordModal: () => set({ editWordModalOpen: false, focusedWord: null }),

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

    //View Word Modal
    viewWordModalOpen: false,
    openViewWordModal: (word) => set({ viewWordModalOpen: true, focusedWord: word }),
    closeViewWordModal: () => set({ viewWordModalOpen: false, focusedWord: null }),

    //Edit Board Modal
    editBoardModalOpen: false,
    openEditBoardModal: () => set({ editBoardModalOpen: true }),
    closeEditBoardModal: () => set({ editBoardModalOpen: false }),

    editBoard: async (userId, metadata, image) => {
      const boardId = get().board?._id;

      if (!boardId) {
        throw new Error('Board does not exist');
      }

      try {
        const updatedBoard = await updateBoard(
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

    //Fetch And Reset
    fetchUsers: async (userId) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      try {
        const users = await fetchBoardUsers(boardId, userId);
        set({ users });
      } catch (error) {
        throw error;
      }
    },

    fetchUserAccess: async (boardId, userId) => {
      try {
        const userAccess = await fetchUserAccessHelper(boardId, userId);
        set({ userAccess });
      } catch (error) {
        throw error;
      }
    },

    fetchBoard: async (boardId, userId) => {
      try {
        const board = await fetchBoardHelper(boardId, userId);
        set({ board });
      } catch (error) {
        throw error;
      }
    },

    fetchWords: async (boardId, userId) => {
      try {
        const words = await fetchWordsHelper(boardId, userId);
        set({ words });
      } catch (error) {
        throw error;
      }
    },

    fetchRootWords: async (boardId, userId) => {
      try {
        const rootWords = await fetchRootWordsHelper(boardId, userId);
        set({ rootWords });
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
        users: null,
        rootWords: null,
        focusedWord: null,
      });
    }
  }))
);

export default useBoardStore;
