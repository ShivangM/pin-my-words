'use client';
import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore';

const protectedRoutes = ['boards'];

const ClientProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [userData] = useUserStore((state) => [state.userData]);

  useEffect(() => {
    if (protectedRoutes.includes(pathname.split('/')[1])) {
      if (userData === null) {
        router.push('/login');
      }
    }
  }, [userData, pathname, router]);

  return <div>{children}</div>;
};

export default ClientProvider;
