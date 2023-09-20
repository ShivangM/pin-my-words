import {
  Board,
  BoardAccess,
  BoardModes,
  BoardUser,
} from '@/interfaces/Board.d';
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
import { Notification, NotificationType } from '@/interfaces/Notification.d';
import fetchNotificationsFromBoard from '@/lib/Notifications/fetchNotifications';
import addNotificationToBoard from '@/lib/Notifications/addNotifictionToBoard';
import { User } from '@/interfaces/User.d';
import editRootWordFromBoard from '@/lib/Root Words/editRootWordFromBoard';
import deleteRootWordFromBoard from '@/lib/Root Words/deleteRootWordFromBoard';
import fetchRootWordHelper from '@/lib/Root Words/fetchRootWord';

interface BoardState {
  //Board operations
  boards: Board[];
  board: null | Board;
  boardMode: null | BoardModes;
  toggleBoardMode: () => void;
  addBoard: (board: Board, users?: BoardUser[], image?: File) => Promise<void>;
  fetchBoards: (
    userId: string,
    limit: number,
    lastVisibleDocId?: string
  ) => Promise<void>;
  fetchBoard: (boardId: string, userId: string) => void;
  deleteBoard: (userId: string) => Promise<void>;
  editBoard: (user: User, board: Board, image?: File) => Promise<void>;

  //User operations
  users: BoardUser[];
  userAccess: null | BoardAccess;
  fetchUsers: (
    userId: string,
    limit: number,
    lastVisibleDocId?: string
  ) => Promise<void>;
  fetchUserAccess: (boardId: string, userId: string) => Promise<void>;
  addUser: (user: BoardUser, admin: User) => Promise<void>;
  leaveBoard: (user: User) => Promise<void>;
  removeUser: (user: BoardUser, admin: User) => Promise<void>;
  updateAccess: (
    user: BoardUser,
    admin: User,
    access: BoardAccess
  ) => Promise<void>;

  //Words operations
  words: Word[];
  wordsLoading: boolean;
  fetchWords: (
    boardId: string,
    userId: string,
    limit: number,
    lastVisibleDocId?: string
  ) => Promise<void>;
  addWord: (word: Word, user: User, image?: File) => Promise<void>;
  deleteWord: (word: Word, user: User) => Promise<void>;
  editWord: (word: Word, user: User, image?: File) => Promise<void>;

  //Root Words operations
  rootWords: RootWord[];
  rootWordsLoading: boolean;
  fetchRootWords: (
    boardId: string,
    userId: string,
    limit: number,
    lastVisibleDocId?: string
  ) => Promise<void>;
  addRootWord: (word: RootWord, user: User) => Promise<void>;
  deleteRootWord: (word: RootWord, user: User) => Promise<void>;
  editRootWord: (word: RootWord, user: User) => Promise<void>;
  fetchRootWord: (rootWordId: string, userId: string) => Promise<RootWord>;

  //Filter operations
  filteredWords: Word[];
  selectedDate: null | DayValue;
  selectedRootWord: null | RootWord;
  // filterByDate: (
  //   date: DayValue,
  //   userId: string,
  //   limit: number,
  //   lastVisibleDocId?: string
  // ) => Promise<void>;
  // filterByRootWord: (rootWordId: string, userId: string) => Promise<void>;
  setSelectedDate: (date: DayValue) => void;
  setSelectedRootWord: (rootWord: RootWord) => void;
  resetFilter: () => void;

  //Notifications operations
  notifications: Notification[];
  fetchNotifications: (
    userId: string,
    limit: number,
    lastVisibleDocId?: string
  ) => Promise<void>;
  addNotification: (
    notification: Notification,
    userId: string
  ) => Promise<void>;

  //Pagination operations
  currentPage: number;
  setCurrentPage: (page: number) => void;

  //Reset
  reset: () => void;
}

const initialState = {
  //Board operations
  boards: [],
  board: null,
  boardMode: BoardModes.WORDS,

  //User operations
  users: [],
  userAccess: null,

  //Words operations
  words: [],
  wordsLoading: false,

  //Root Words operations
  rootWords: [],
  rootWordsLoading: false,

  //Filter operations
  filteredWords: [],
  selectedDate: null,
  selectedRootWord: null,

  //Notifications operations
  notifications: [],

  //Pagination operations
  currentPage: 0,
};

const useBoardStore = create<BoardState>()(
  devtools((set, get) => ({
    ...initialState,

    //Board operations

    toggleBoardMode: () => {
      const boardMode = get().boardMode;
      if (boardMode === BoardModes.WORDS) {
        set({ boardMode: BoardModes.ROOT_WORDS });
      } else {
        set({ boardMode: BoardModes.WORDS });
      }
    },

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

    fetchBoards: async (userId, limit, lastVisibleDocId) => {
      try {
        const boards = await fetchBoardsHelper(userId, limit, lastVisibleDocId);
        set({ boards: [...get().boards!, ...boards] });
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
        set({
          board: null,
          boards: get().boards?.filter((b) => b._id !== boardId),
        });
      } catch (error) {
        throw error;
      }
    },

    editBoard: async (user, board, image) => {
      const boardId = get().board?._id;
      const userId = user.uid;

      if (!boardId || !userId) return;

      try {
        const updatedBoard = await updateBoard(userId, boardId, board, image);

        set({ board: updatedBoard });

        const notification = {
          type: NotificationType.BOARD_UPDATED,
          message: `Board settings updated by ${user.name}`,
        } as Notification;

        get().addNotification(notification, userId);
      } catch (error) {
        throw error;
      }
    },

    //User operations

    fetchUsers: async (userId, limit, lastVisibleDocId) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      try {
        const users = await fetchBoardUsers(
          boardId,
          userId,
          limit,
          lastVisibleDocId
        );
        set({ users: [...get().users!, ...users] });
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

    addUser: async (user, admin) => {
      const boardId = get().board?._id;
      if (!boardId || !admin) return;

      try {
        const userAdded = await addUserToBoard(boardId, admin.uid, user);
        set({
          users: [userAdded, ...get().users!],
          board: { ...get().board!, totalUsers: get().board?.totalUsers! + 1 },
        });

        const notification = {
          type: NotificationType.USER_ADDED,
          message: `${user.name} added by ${admin.name}`,
        } as Notification;

        get().addNotification(notification, admin.uid);
      } catch (error) {
        throw error;
      }
    },

    leaveBoard: async (user) => {
      const boardId = get().board?._id;
      const userId = user.uid;

      if (!boardId || !userId) return;

      try {
        await leaveBoardHelper(boardId, userId);

        const notification = {
          type: NotificationType.USER_LEFT,
          message: `${user.name} left the board`,
        } as Notification;

        get().addNotification(notification, userId);
      } catch (error) {
        throw error;
      }
    },

    removeUser: async (user, admin) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      try {
        await removeUserFromBoard(user, admin.uid, boardId);
        set({
          users: get().users?.filter((u) => u.uid !== user.uid),
          board: { ...get().board!, totalUsers: get().board?.totalUsers! - 1 },
        });

        const notification = {
          type: NotificationType.USER_REMOVED,
          message: `${user.name} removed by ${admin.name}`,
        } as Notification;

        get().addNotification(notification, admin.uid);
      } catch (error) {
        throw error;
      }
    },

    updateAccess: async (user, admin, access) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      try {
        await updateUserAccess(user, admin.uid, boardId, access);
        set({
          users: get().users?.map((u) => {
            if (u.uid === user.uid) {
              return { ...u, access };
            }
            return u;
          }),
        });

        const notification = {
          type: NotificationType.USER_UPDATED,
          message: `${user.name} access updated to ${access} by ${admin.name}`,
        } as Notification;

        get().addNotification(notification, admin.uid);
      } catch (error) {
        throw error;
      }
    },

    //Words operations
    fetchWords: async (boardId, userId, limit, lastVisibleDocId) => {
      set({ wordsLoading: true });
      try {
        const words = await fetchWordsHelper(
          boardId,
          userId,
          limit,
          lastVisibleDocId
        );
        set({ words: [...get().words, ...words] });
      } catch (error) {
        throw error;
      } finally {
        set({ wordsLoading: false });
      }
    },

    addWord: async (word, user, image) => {
      const boardId = get().board?._id;
      const userId = user.uid;

      if (!boardId || !userId) return;

      try {
        const wordAdded = await addWordToBoard(boardId, word, userId, image);
        set({
          words: [wordAdded, ...get().words!],
          board: { ...get().board!, totalWords: get().board?.totalWords! + 1 },
        });

        const notification = {
          type: NotificationType.WORD_ADDED,
          message: `Word ${word.word} added by ${user.name}`,
        } as Notification;

        get().addNotification(notification, userId);
      } catch (error) {
        throw error;
      }
    },

    deleteWord: async (word, user) => {
      const boardId = get().board?._id;
      const wordId = word._id;
      const userId = user.uid;

      if (!boardId || !userId || !wordId) return;

      try {
        await deleteWordFromBoard(boardId, wordId, userId);
        set({
          words: get().words?.filter((word) => word._id !== wordId),
          board: { ...get().board!, totalWords: get().board?.totalWords! - 1 },
        });

        const notification = {
          type: NotificationType.WORD_DELETED,
          message: `Word ${word.word} deleted by ${user.name}`,
        } as Notification;

        get().addNotification(notification, userId);
      } catch (error) {
        throw error;
      }
    },

    editWord: async (word, user, image) => {
      const boardId = get().board?._id;
      const userId = user.uid;

      if (!boardId) {
        throw new Error('Board does not exist');
      }

      try {
        const editedWord = await editWordFromBoard(
          word,
          boardId,
          userId,
          image
        );
        set({
          words: get().words?.map((word) => {
            if (word._id === editedWord._id) {
              return editedWord;
            }
            return word;
          }),
        });

        const notification = {
          type: NotificationType.WORD_UPDATED,
          message: `Word ${word.word} updated by ${user.name}`,
        } as Notification;

        get().addNotification(notification, userId);
      } catch (error) {
        throw error;
      }
    },

    //Root Words operations
    fetchRootWords: async (boardId, userId, limit, lastVisibleDocId) => {
      set({ rootWordsLoading: true });
      try {
        const rootWords = await fetchRootWordsHelper(
          boardId,
          userId,
          limit,
          lastVisibleDocId
        );
        set({ rootWords: [...get().rootWords, ...rootWords] });
      } catch (error) {
        throw error;
      } finally {
        set({ rootWordsLoading: false });
      }
    },

    addRootWord: async (rootWord, user) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      const userId = user.uid;

      try {
        const rootWordAdded = await addRootWordToBoard(
          boardId,
          rootWord,
          userId
        );
        set({
          rootWords: [rootWordAdded, ...get().rootWords!],
          board: {
            ...get().board!,
            totalRootWords: get().board?.totalRootWords! + 1,
          },
        });

        const notification = {
          type: NotificationType.ROOT_WORD_ADDED,
          message: `Root word ${rootWordAdded.root} added by ${user.name}`,
        } as Notification;

        get().addNotification(notification, userId);
      } catch (error) {
        throw error;
      }
    },

    deleteRootWord: async (rootWord, user) => {
      const boardId = get().board?._id;
      const rootWordId = rootWord._id;
      const userId = user.uid;

      if (!boardId || !rootWordId || !userId) return;

      try {
        await deleteRootWordFromBoard(boardId, rootWordId, userId);
        set({
          rootWords: get().rootWords?.filter(
            (rootWord) => rootWord._id !== rootWordId
          ),
          board: {
            ...get().board!,
            totalRootWords: get().board?.totalRootWords! - 1,
          },
        });

        const notification = {
          type: NotificationType.ROOT_WORD_DELETED,
          message: `Root Word ${rootWord.root} deleted by ${user.name}`,
        } as Notification;

        get().addNotification(notification, userId);
      } catch (error) {
        throw error;
      }
    },

    editRootWord: async (rootWord, user) => {
      const boardId = get().board?._id;
      const userId = user.uid;

      if (!boardId || !userId || !rootWord) return;

      try {
        const updatedRootWord = await editRootWordFromBoard(
          rootWord,
          boardId,
          userId
        );
        set({
          rootWords: get().rootWords?.map((rootWord) => {
            if (rootWord._id === updatedRootWord._id) {
              return updatedRootWord;
            }
            return rootWord;
          }),
        });

        const notification = {
          type: NotificationType.ROOT_WORD_UPDATED,
          message: `Root Word ${rootWord.root} updated by ${user.name}`,
        } as Notification;

        get().addNotification(notification, userId);
      } catch (error) {
        throw error;
      }
    },

    fetchRootWord: async (rootWordId, userId) => {
      const boardId = get().board?._id;

      if (!boardId) {
        throw new Error('Board does not exist');
      }

      try {
        const rootWord = await fetchRootWordHelper(boardId, rootWordId, userId);
        return rootWord;
      } catch (error) {
        throw error;
      }
    },

    //Filter operations

    setSelectedDate: (date) => {
      set({ selectedDate: date });
    },

    setSelectedRootWord: (rootWord) => {
      set({ selectedRootWord: rootWord });
    },

    // filterByDate: async (date, userId, limit, lastVisibleDocId) => {
    //   const boardId = get().board?._id;
    //   if (!boardId) return;

    //   set({ selectedDate: date, wordsLoading: true });

    //   try {
    //     const filteredWords = await fetchWords(
    //       boardId,
    //       userId,
    //       limit,
    //       lastVisibleDocId,
    //       date
    //     );

    //     set({ filteredWords: [...get().filteredWords, ...filteredWords] });
    //   } catch (error) {
    //     throw error;
    //   } finally {
    //     set({ wordsLoading: false });
    //   }
    // },

    // filterByRootWord: async (rootWordId, userId) => {
    //   const boardId = get().board?._id;
    //   if (!boardId) return;

    //   set({
    //     selectedRootWord: get().rootWords?.find(
    //       (rootWord) => rootWord._id === rootWordId
    //     ),
    //   });

    //   try {
    //     const filteredWords = await fetchWordsByRoot(
    //       boardId,
    //       userId,
    //       rootWordId
    //     );
    //     set({ filteredWords });
    //   } catch (error) {
    //     throw error;
    //   }
    // },

    //Notifications operations
    fetchNotifications: async (userId, limit, lastVisibleDocId) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      try {
        const notifications = await fetchNotificationsFromBoard(
          boardId,
          userId,
          limit,
          lastVisibleDocId
        );
        set({ notifications: [...get().notifications!, ...notifications] });
      } catch (error) {
        throw error;
      }
    },

    addNotification: async (notification, userId) => {
      const boardId = get().board?._id;
      if (!boardId) return;

      try {
        const notificationAdded = await addNotificationToBoard(
          boardId,
          userId,
          notification
        );
        if (notificationAdded.type !== NotificationType.USER_LEFT) {
          set({
            notifications: [notificationAdded, ...get().notifications!],
            board: {
              ...get().board!,
              totalNotifications: get().board?.totalNotifications! + 1,
            },
          });
        }
      } catch (error) {
        get().fetchNotifications(userId, 10);
      }
    },

    //Pagination operations
    setCurrentPage: (page) => {
      set({ currentPage: page });
    },

    resetFilter: () => {
      set({ filteredWords: [], selectedDate: null, selectedRootWord: null });
    },

    reset: () => {
      set(initialState);
    },
  }))
);

export default useBoardStore;
