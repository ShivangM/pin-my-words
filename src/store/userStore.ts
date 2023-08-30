import { User } from '@/interfaces/User';
import { auth } from '@/utils/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  userData: null | User;
  setUserData: (user: User | null) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        userData: null,
        setUserData: (user) => {
          set({ userData: user });
        },

        logout: async () => {
          signOut(auth)
            .then(() => {
              set({ userData: null });
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.error(errorCode, errorMessage);
            });

          useUserStore.persist.clearStorage();
        },
      }),
      {
        name: 'user-storage',
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({ userData: state.userData }),
        // onRehydrateStorage: (state) => {
        //   console.log('hydration starts');

        //   // optional
        //   return (state, error) => {
        //     if (error) {
        //       console.log('an error happened during hydration', error);
        //     } else {
        //       const auth = getAuth();
        //       if (!auth) {
        //         state?.setUserData(null);
        //       }
        //     }
        //   };
        // },
      }
    )
  )
);

export default useUserStore;
