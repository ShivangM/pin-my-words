import { BoardUser } from '@/interfaces/Board.d';
import { RootWord, Word } from '@/interfaces/Word.d';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  sidePanelOpen: boolean;
  toggleSidePanel: () => void;

  //Board operations
  addBoardModalOpen: boolean;
  toggleAddBoardModal: () => void;

  deleteBoardModalOpen: boolean;
  toggleDeleteBoardModal: () => void;

  editBoardModalOpen: boolean;
  toggleEditBoardModal: () => void;

  //Users operations
  focusedUser: BoardUser | null;

  addUserModalOpen: boolean;
  toggleAddUserModal: () => void;

  removeUserModalOpen: boolean;
  toggleRemoveUserModal: (user: BoardUser | null) => void;

  updateUserAccessModalOpen: boolean;
  toggleUpdateUserAccessModal: (user: BoardUser | null) => void;

  leaveBoardModalOpen: boolean;
  toggleLeaveBoardModal: () => void;

  //Words operations
  focusedWord: Word | null;

  addWordModalOpen: boolean;
  toggleAddWordModal: () => void;

  deleteWordModalOpen: boolean;
  toggleDeleteWordModal: (word: Word | null) => void;

  editWordModalOpen: boolean;
  toggleEditWordModal: (word: Word | null) => void;

  viewWordModalOpen: boolean;
  toggleViewWordModal: (word: Word | null) => void;

  //Root Words operations
  focusedRootWord: RootWord | null;

  addRootWordModalOpen: boolean;
  toggleAddRootWordModal: () => void;

  deleteRootWordModalOpen: boolean;
  toggleDeleteRootWordModal: (rootWord: RootWord | null) => void;

  editRootWordModalOpen: boolean;
  toggleEditRootWordModal: (rootWord: RootWord | null) => void;

  viewRootWordModalOpen: boolean;
  toggleViewRootWordModal: (rootWord: RootWord | null) => void;
}

const useUIStore = create<UIState>()(
  devtools((set, get) => ({
    sidePanelOpen: false,
    toggleSidePanel: () =>
      set((state) => ({ sidePanelOpen: !state.sidePanelOpen })),

    //Board operations
    addBoardModalOpen: false,
    toggleAddBoardModal: () =>
      set((state) => ({ addBoardModalOpen: !state.addBoardModalOpen })),

    deleteBoardModalOpen: false,
    toggleDeleteBoardModal: () =>
      set((state) => ({ deleteBoardModalOpen: !state.deleteBoardModalOpen })),

    editBoardModalOpen: false,
    toggleEditBoardModal: () =>
      set((state) => ({ editBoardModalOpen: !state.editBoardModalOpen })),

    //Users operations
    focusedUser: null,

    addUserModalOpen: false,
    toggleAddUserModal: () =>
      set((state) => ({ addUserModalOpen: !state.addUserModalOpen })),

    removeUserModalOpen: false,
    toggleRemoveUserModal: (user) =>
      set((state) => ({
        focusedUser: user,
        removeUserModalOpen: !state.removeUserModalOpen,
      })),

    updateUserAccessModalOpen: false,
    toggleUpdateUserAccessModal: (user) =>
      set((state) => ({
        focusedUser: user,
        updateUserAccessModalOpen: !state.updateUserAccessModalOpen,
      })),

    leaveBoardModalOpen: false,
    toggleLeaveBoardModal: () =>
      set((state) => ({ leaveBoardModalOpen: !state.leaveBoardModalOpen })),

    //Words operations
    focusedWord: null,

    addWordModalOpen: false,
    toggleAddWordModal: () =>
      set((state) => ({ addWordModalOpen: !state.addWordModalOpen })),

    deleteWordModalOpen: false,
    toggleDeleteWordModal: (word) =>
      set((state) => ({
        focusedWord: word,
        deleteWordModalOpen: !state.deleteWordModalOpen,
      })),

    editWordModalOpen: false,
    toggleEditWordModal: (word) =>
      set((state) => ({
        focusedWord: word,
        editWordModalOpen: !state.editWordModalOpen,
      })),

    viewWordModalOpen: false,
    toggleViewWordModal: (word) =>
      set((state) => ({
        focusedWord: word,
        viewWordModalOpen: !state.viewWordModalOpen,
      })),

    //Root Words operations
    focusedRootWord: null,

    addRootWordModalOpen: false,
    toggleAddRootWordModal: () =>
      set((state) => ({ addRootWordModalOpen: !state.addRootWordModalOpen })),

    deleteRootWordModalOpen: false,
    toggleDeleteRootWordModal: (rootWord) =>
      set((state) => ({
        focusedRootWord: rootWord,
        deleteRootWordModalOpen: !state.deleteRootWordModalOpen,
      })),

    editRootWordModalOpen: false,
    toggleEditRootWordModal: (rootWord) =>
      set((state) => ({
        focusedRootWord: rootWord,
        editRootWordModalOpen: !state.editRootWordModalOpen,
      })),

    viewRootWordModalOpen: false,
    toggleViewRootWordModal: (rootWord) =>
      set((state) => ({
        focusedRootWord: rootWord,
        viewRootWordModalOpen: !state.viewRootWordModalOpen,
      })),
  }))
);

export default useUIStore;
