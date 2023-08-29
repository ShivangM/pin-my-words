'use client';
import useUserStore from '@/store/userStore';
import { auth } from '@/utils/firebase';
import { useEffect, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [setUserData] = useUserStore((state) => [state.setUserData]);

  useEffect(() => {
    const listner = auth.onAuthStateChanged(
      (user) => {
        if (user) {
          setUserData(user);
        }
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      listner();
    };
  }, []);

  return (
    <div>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </div>
  );
};

export default ClientProvider;
