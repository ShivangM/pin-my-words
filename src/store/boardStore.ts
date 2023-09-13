import { Board, BoardAccess, BoardUser } from '@/interfaces/Board.d';
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
import leaveBoardHelper from '@/lib/Users/leaveBoard';
import createBoard from '@/lib/Boards/createBoard';
import fetchBoardsHelper from '@/lib/Boards/fetchBoards';
import removeUserFromBoard from '@/lib/Users/removeUserFromBoard';
import updateUserAccess from '@/lib/Users/updateUserAccess';
import { DayValue } from '@hassanmojab/react-modern-calendar-datepicker';
import fetchWords from '@/lib/Words/fetchWords';
import fetchWordsByRoot from '@/lib/Words/fetchWordsByRoot';

interface BoardState {
  //Board operations
  boards: null | Board[];
  board: null | Board;
  addBoard: (board: Board, users?: BoardUser[], image?: File) => Promise<void>;
  fetchBoards: (userId: string) => Promise<void>;
  fetchBoard: (boardId: string, userId: string) => void;
  deleteBoard: (userId: string) => Promise<void>;
  leaveBoard: (userId: string) => Promise<void>;
  editBoard: (userId: string, board: Board, image?: File) => Promise<void>;

  //User operations
  users: null | BoardUser[];
  userAccess: null | BoardAccess;
  fetchUsers: (userId: string) => Promise<void>;
  fetchUserAccess: (boardId: string, userId: string) => Promise<void>;
  addUser: (user: BoardUser, userId: string) => Promise<void>;
  removeUser: (user: BoardUser, userId: string) => Promise<void>;
  updateAccess: (user: BoardUser, userId: string, access: BoardAccess) => Promise<void>;

  //Words operations
  words: null | Word[];
  fetchWords: (boardId: string, userId: string) => Promise<void>;
  addWord: (word: Word, userId: string, image?: File) => Promise<void>;
  deleteWord: (wordId: string, userId: string) => Promise<void>;
  editWord: (word: Word, userId: string, image?: File) => Promise<void>;

  //Root Words operations
  rootWords: null | RootWord[]
  fetchRootWords: (boardId: string, userId: string) => Promise<void>;
  addRootWord: (word: RootWord, userId: string) => Promise<void>;

  //Filter operations
  filteredWords: null | Word[];
  filterByDate: (date: DayValue, userId: string) => Promise<void>;
  filterByRootWord: (rootWordId: string, userId: string) => Promise<void>;
  resetFilter: () => void;

  //Reset
  reset: () => void;
}

const initialState = {
  //Board operations
  boards: null,
  board: null,

  //User operations
  users: null,
  userAccess: null,

  //Words operations
  words: null,

  //Root Words operations
  rootWords: null,

  //Filter operations
  filteredWords: null,
}

const useBoardStore = create<BoardState>()(
  devtools((set, get) => ({
    ...initialState,

    //Board operations
    addBoard: async (board, users, image) => {
      try {
        const newBoard = await createBoard(board, users, image);

        set({
          boards: [newBoard, ...get().boards!],
        });
      } catch (error) {
        throw error;
      }
    },

    fetchBoards: async (userId) => {
      try {
        const boards = await fetchBoardsHelper(userId);
        set({ boards });
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

    leaveBoard: async (userId) => {
      const boardId = get().board?._id;
      if (!boardId) {
        throw new Error('Board does not exist');
      }

      try {
        await leaveBoardHelper(boardId, userId);
      } catch (error) {
        throw error;
      }
    },

    editBoard: async (userId, board, image) => {
      const boardId = get().board?._id;

      if (!boardId) {
        throw new Error('Board does not exist');
      }

      try {
        const updatedBoard = await updateBoard(
          userId,
          boardId,
          board,
          image
        );

        set({ board: updatedBoard });
      } catch (error) {
        throw error;
      }
    },

    //User operations

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

    addUser: async (user, userId) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      try {
        const userAdded = await addUserToBoard(boardId, userId, user);
        set({ users: [userAdded, ...get().users!] });
      } catch (error) {
        throw error;
      }
    },

    removeUser: async (user, userId) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      try {
        await removeUserFromBoard(user, userId, boardId);
        set({
          users: get().users?.filter((u) => u.uid !== user.uid),
        });
      } catch (error) {
        throw error;
      }
    },

    updateAccess: async (user, userId, access) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      try {
        await updateUserAccess(user, userId, boardId, access);
        set({
          users: get().users?.map((u) => {
            if (u.uid === user.uid) {
              return { ...u, access };
            }
            return u;
          }),
        });
      } catch (error) {
        throw error;
      }
    },

    //Words operations
    fetchWords: async (boardId, userId) => {
      try {
        const words = await fetchWordsHelper(boardId, userId);
        set({ words });
      } catch (error) {
        throw error;
      }
    },

    addWord: async (word, userId, image) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      try {
        const wordAdded = await addWordToBoard(boardId, word, userId, image);
        set({ words: [wordAdded, ...get().words!] });
      } catch (error) {
        throw error;
      }
    },

    deleteWord: async (wordId, userId) => {
      try {
        await deleteWordFromBoard(get().board!._id, wordId, userId);
        set({
          words: get().words?.filter((word) => word._id !== wordId),
        });
      } catch (error) {
        throw error;
      }
    },

    editWord: async (word, userId, image) => {
      const boardId = get().board?._id;

      if (!boardId) {
        throw new Error('Board does not exist');
      }

      try {
        const editedWord = await editWordFromBoard(word, boardId, userId, image);
        set({
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

    //Root Words operations
    fetchRootWords: async (boardId, userId) => {
      try {
        const rootWords = await fetchRootWordsHelper(boardId, userId);
        set({ rootWords });
      } catch (error) {
        throw error;
      }
    },

    addRootWord: async (rootWord, userId) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      try {
        const rootWordAdded = await addRootWordToBoard(boardId, rootWord, userId);
        set({ rootWords: [rootWordAdded, ...get().rootWords!] });
      } catch (error) {
        throw error;
      }
    },


    // fetchRootWord: async (userId) => {
    //   const boardId = get().board?._id;
    //   const rootId = get().focusedRootWord;

    //   if (!boardId) {
    //     throw new Error('Board does not exist');
    //   } else if (!rootId) {
    //     throw new Error('Root word does not exist');
    //   }

    //   try {
    //     const rootWord = await fetchRootWordHelper(boardId, rootId, userId);
    //     return rootWord;
    //   } catch (error) {
    //     throw error;
    //   }
    // },

    //Filter operations
    filterByDate: async (date, userId) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      try {
        const filteredWords = await fetchWords(boardId, userId, date);
        set({ filteredWords });
      } catch (error) {
        throw error;
      }
    },

    filterByRootWord: async (rootWordId, userId) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      try {
        const filteredWords = await fetchWordsByRoot(boardId, userId, rootWordId);
        set({ filteredWords });
      } catch (error) {
        throw error;
      }
    },

    resetFilter: () => {
      set({ filteredWords: null });
    },

    reset: () => {
      set(initialState);
    }
  }))
);

export default useBoardStore;
