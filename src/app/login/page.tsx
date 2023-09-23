'use client';
import { useEffect, useCallback } from 'react';
import 'firebaseui/dist/firebaseui.css';
import { auth } from '@/utils/firebase';
import firebaseui from 'firebaseui';
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import useUserStore from '@/store/userStore';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [loginUser, userData] = useUserStore((state) => [
    state.loginUser,
    state.userData,
  ]);

  const router = useRouter();

  useEffect(() => {
    if (userData) {
      router.push('/boards');
    }
  }, [userData, router]);

  const loadFirebaseui = useCallback(async () => {
    const firebaseui = await import('firebaseui');

    const uiConfig: firebaseui.auth.Config = {
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
        signInSuccessWithAuthResult: loginUser,
        signInFailure(error) {
          console.log(error);
        },
      },
    };

    const firebaseUi =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    firebaseUi.start('#firebaseui-auth-container', uiConfig);
  }, [loginUser]);

  useEffect(() => {
    loadFirebaseui();
  }, [loadFirebaseui]);

  return (
    <div className="">
      <div id="firebaseui-auth-container" />
    </div>
  );
};

export default SignIn;
