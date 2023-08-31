'use client';
import useUserStore from '@/store/userStore';
import { useEffect, useState } from 'react';
import LoginButton from './LoginButton';
import UserDropdown from './UserDropdown';

const User = () => {
  const [userData] = useUserStore((state) => [state.userData]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (userData) setShowDropdown(true);
    else setShowDropdown(false);
  }, [userData]);

  return <div>{showDropdown ? <UserDropdown /> : <LoginButton />}</div>;
};

export default User;
