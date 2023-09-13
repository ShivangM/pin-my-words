'use client';
import useBoardStore from '@/store/boardStore';
import useUIStore from '@/store/uiStore';
import useUserStore from '@/store/userStore';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
type Props = {};

const DeleteBoardModal = (props: Props) => {
  const [deleteBoard] =
    useBoardStore((state) => [
      state.deleteBoard,
    ]);

  const [deleteBoardModalOpen, toggleDeleteBoardModal] = useUIStore(state => [state.deleteBoardModalOpen, state.toggleDeleteBoardModal])

  const userData = useUserStore((state) => state.userData);
  const [deleteBoardLoading, setDeleteBoardLoading] = useState<boolean>(false)
  const router = useRouter();

  const handleDeleteBoard = async () => {
    setDeleteBoardLoading(true);
    toast.loading('Deleting board...', {
      toastId: 'delete-board',
    });

    try {
      await deleteBoard(userData?.uid!);
      router.push('/boards');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleteBoardLoading(false);
      toggleDeleteBoardModal();
      toast.dismiss('delete-board');
    }
  };
  return (
    <>
      <Transition show={deleteBoardModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={toggleDeleteBoardModal}
        >
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
                    Delete Board
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this board?
                    </p>
                  </div>

                  <div className="mt-4 flex items-center space-x-4">
                    <button
                      onClick={toggleDeleteBoardModal}
                      className="modalBtnPrev"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteBoard}
                      className="modalBtnNext"
                      disabled={deleteBoardLoading}
                    >
                      Delete Board
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default DeleteBoardModal;
