import { User } from '@/interfaces/User';
import db, { auth } from '@/utils/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  userData: null | User;
  logout: () => void;
  loginUser: (authRes: any) => boolean;
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        userData: null,

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

        loginUser: (authResult) => {
          const user = authResult.user;
          const userRef = doc(db, 'users', user.uid);

          getDoc(userRef).then((userDoc) => {
            if (userDoc.exists()) {
              set({
                userData: { ...userDoc.data(), uid: userDoc.id } as User,
              });
            } else {
              const userData = {
                email: user.email!,
                name: user.displayName!,
                image: user.photoURL || undefined,
              } as User;

              setDoc(doc(db, 'users', user.uid!), userData)
                .then(() => {
                  set({
                    userData: { ...userDoc.data(), uid: user.uid } as User,
                  });
                })
                .catch((error) => {
                  throw error;
                });
            }
          });

          return false;
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
