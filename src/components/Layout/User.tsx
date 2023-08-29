'use client';
import useUserStore from '@/store/userStore';
import LoginButton from './LoginButton';
import UserDropdown from './UserDropdown';

const User = () => {
  const [userData] = useUserStore((state) => [state.userData]);

  return <div>{userData ? <UserDropdown /> : <LoginButton />}</div>;
};

export default User;
