'use client';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { BsBellFill } from 'react-icons/bs';

const NotificationsDropdown = () => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="text-gray-800 focus:ring-2 rounded-full p-1 h-7 flex justify-center items-center aspect-square focus:ring-gray-300">
        <BsBellFill className="h-full w-full" />
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
            <Menu.Items
              className="py-2 px-1 space-y-2"
              aria-labelledby="user-notifications"
            ></Menu.Items>
          </div>
        </div>
      </Transition>
    </Menu>
  );
};

export default NotificationsDropdown;
