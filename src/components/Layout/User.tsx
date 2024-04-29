'use client';
import useUserStore from '@/store/userStore';
import { useEffect, useState } from 'react';
import LoginButton from './LoginButton';
import NotificationsDropdown from './NotificationsDropdown';
import UserDropdown from './UserDropdown';

const User = () => {
  const [userData] = useUserStore((state) => [state.userData]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setShowDropdown(userData !== null);
  }, [userData]);

  return (
    <div>
      {showDropdown ? (
        <div className="flex items-center space-x-4">
          <NotificationsDropdown />
          <UserDropdown />
        </div>
      ) : (
        <LoginButton />
      )}
    </div>
  );
};

export default User;
