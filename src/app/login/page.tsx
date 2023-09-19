'use client';
import { useEffect, useCallback } from 'react';
import 'firebaseui/dist/firebaseui.css';
import db, { auth } from '@/utils/firebase';
import firebaseui from 'firebaseui';
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { User } from '@/interfaces/User';
import useUserStore from '@/store/userStore';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const loadFirebaseui = useCallback(async () => {
    const firebaseui = await import('firebaseui');
    const firebaseUi =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    firebaseUi.start('#firebaseui-auth-container', uiConfig);
  }, []);

  useEffect(() => {
    loadFirebaseui();
  }, []);

  const [setUserData] = useUserStore((state) => [state.setUserData]);
  const router = useRouter();

  const uiConfig: firebaseui.auth.Config = {
    signInSuccessUrl: '/boards',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      EmailAuthProvider.PROVIDER_ID,
    ],

    tosUrl: 'tos',
    privacyPolicyUrl: 'privacy-policy',
    siteName: 'Pin My Words',
    callbacks: {
      signInSuccessWithAuthResult: (authResult) => {
        if (authResult) {
          const user = authResult.user;
          const userRef = doc(db, 'users', user.uid);
          const userDoc = getDoc(userRef);

          userDoc.then(async (docSnapshot) => {
            if (docSnapshot.exists()) {
              setUserData({
                ...docSnapshot.data(),
                uid: docSnapshot.id,
              } as User);
            } else {
              const userData = {
                email: user.email!,
                name: user.displayName!,
                image: user.photoURL || undefined,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                totalBoards: 0,
              };

              setDoc(doc(db, 'users', user.uid!), userData);
              setUserData({ ...userData, uid: user.uid! });
            }

            router.push('/boards');
          });
        }
        return false;
      },
    },
  };

  return (
    <main className="py-20">
      <div id="firebaseui-auth-container" />
    </main>
  );
};

export default SignIn;
