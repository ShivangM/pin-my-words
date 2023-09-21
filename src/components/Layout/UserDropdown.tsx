'use client';
import userDropdownLinks from '../../constants/user-dropdown-links.json';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import useUserStore from '@/store/userStore';
import { CommonLink } from '@/interfaces/Typings.d';

const UserDropdownLink = ({ link }: { link: CommonLink }) => {
  const { label, href } = link;
  return (
    <Menu.Item>
      {({ active }) => (
        <Link
          href={href}
          className="block px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
        >
          {label}
        </Link>
      )}
    </Menu.Item>
  );
};

const UserDropdown = () => {
  const [logout, userData] = useUserStore((state) => [
    state.logout,
    state.userData,
  ]);

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300">
        <Image
          className="rounded-full"
          height={40}
          width={40}
          src={userData?.image || '/assets/Dummy Profile.png'}
          alt={userData?.name || 'User'}
        />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="absolute z-50 right-0 top-full mt-4 w-60">
          <div className="text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow">
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900">
                {userData?.name || 'User'}
              </span>
              <span className="block text-sm  text-gray-500 truncate">
                {userData?.email || "user's email"}
              </span>
            </div>
            <Menu.Items
              className="py-2 px-1 space-y-2"
              aria-labelledby="user-menu-button"
            >
              {userDropdownLinks.map((link, idx) => (
                <UserDropdownLink key={idx} link={link} />
              ))}

              <button
                onClick={logout}
                className="block px-4 rounded-lg py-2 text-sm text-white text-center w-full bg-red-500 transition-all ease-in-out duration-300 hover:bg-red-600"
              >
                Log Out
              </button>
            </Menu.Items>
          </div>
        </div>
      </Transition>
    </Menu>
  );
};

export default UserDropdown;
