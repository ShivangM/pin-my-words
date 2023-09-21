'use client';
import useUserStore from '@/store/userStore';
import { useEffect, useState } from 'react';
import LoginButton from './LoginButton';
import UserDropdown from './UserDropdown';

const User = () => {
  const [userData] = useUserStore((state) => [state.userData]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setShowDropdown(userData !== null);
  }, [userData]);

  return <div>{showDropdown ? <UserDropdown /> : <LoginButton />}</div>;
};

export default User;
