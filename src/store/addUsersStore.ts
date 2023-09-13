import { BoardUser } from '@/interfaces/Board';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AddUsersState {
    users: BoardUser[];
    addUser: (user: BoardUser) => void;
    removeUser: (userId: string) => void;
    reset: () => void;
}

const initialState = {
    users: [],
}

const useAddUsersStore = create<AddUsersState>()(
    devtools((set, get) => ({
        ...initialState,

        addUser: (user: BoardUser) => {
            set({ users: [...get().users, user] })
        },

        removeUser: (userId: string) => {
            set({ users: get().users.filter(user => user.uid !== userId) })
        },

        reset: () => {
            set(initialState);
        }
    }))
);

export default useAddUsersStore;
