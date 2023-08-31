'use client';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Fragment } from 'react';
import InviteUsers from './InviteUsers';
import useBoardsStore from '@/store/boardsStore';
import BasicDetails from './BasicDetails';
import UploadImage from './UploadImage';
import { CreateBoardSteps } from '@/interfaces/Board.d';

const CreateNewBoard = () => {
  const [createBoardStep, modalOpen, closeModal, openModal] = useBoardsStore(
    (state) => [
      state.createBoardStep,
      state.modalOpen,
      state.closeModal,
      state.openModal,
    ]
  );

  const Step = () => {
    switch (createBoardStep) {
      case CreateBoardSteps.ENTER_DETAILS:
        return <BasicDetails />;
      case CreateBoardSteps.INVITE_USERS:
        return <InviteUsers />;
      case CreateBoardSteps.SELECT_THUMBNAIL:
        return <UploadImage />;
      default:
        return <BasicDetails />;
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="p-6 text-left cursor-pointer border-2 border-dashed border-spacing-4 hover:border-brand transition-all ease-in-out duration-200 rounded-md"
      >
        <Image
          src="/assets/board-placeholder.svg"
          alt="Create a new board"
          width={500}
          height={288}
          className="object-cover object-center w-full rounded-md"
        />
        <div className="mt-6 mb-2">
          <h2 className="text-xl font-semibold">Create a new board</h2>
        </div>
        <p className="">Add a new board.</p>
      </button>

      <Transition show={modalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create New Board
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please enter the details to create a new board.
                    </p>
                  </div>

                  <Step />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CreateNewBoard;
