import { BoardAccess, BoardUser } from '@/interfaces/Board.d';
import Image from 'next/image';
import React, { Fragment } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { Menu, Transition } from '@headlessui/react'
import useBoardStore from '@/store/boardStore';
import Link from 'next/link';
import useUIStore from '@/store/uiStore';

type Props = {
  user: BoardUser;
};

const UserCard = ({ user }: Props) => {
  const [userAccess, owner] = useBoardStore((state) => [state.userAccess, state.board?.owner]);
  const [toggleUpdateUserAccessModal, toggleRemoveUserModal] = useUIStore((state) => [state.toggleUpdateUserAccessModal, state.toggleRemoveUserModal])

  return (
    <div className="relative bg-white rounded-lg shadow flex items-center justify-between p-3">
      <div className="flex items-center space-x-2">
        <Image height={30} width={30} src={user.image || '/assets/Dummy Profile.png'} alt={user.name} className="rounded-full" />
        <div className="">
          <Link href={`/profile/${user.uid}`} className="text-sm hover:underline font-medium leading-5">{user.name}</Link>
          <ul className="flex space-x-1 text-xs font-normal leading-4 text-gray-500">
            <li className='w-28 truncate'>{user?.email}</li>
            <li>&middot;</li>
            <li>{user?.access}</li>
          </ul>
        </div>
      </div>

      {
        (userAccess === BoardAccess.ADMIN || userAccess === BoardAccess.OWNER) && user.access !== BoardAccess.OWNER ?
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-5 p-2 text-sm font-medium text-gray-900 hover:bg-opacity-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                <BiDotsVerticalRounded />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute z-50 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? 'bg-gray-100' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => toggleUpdateUserAccessModal(user)}
                      >
                        Edit Access
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? 'bg-gray-100' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => toggleRemoveUserModal(user)}
                      >
                        Remove User
                      </button>
                    )}
                  </Menu.Item>

                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          : null
      }
    </div>
  );
};

export default UserCard;
