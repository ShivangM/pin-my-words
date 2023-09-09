'use client';
import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
type Props = {};

const DeleteWordModal = (props: Props) => {
  const [deleteWord, closeDeleteWordModal, deleteWordModalOpen, wordsToDelete] =
    useBoardStore((state) => [
      state.deleteWord,
      state.closeDeleteWordModal,
      state.deleteWordModalOpen,
      state.wordsToDelete
    ]);

  const userData = useUserStore((state) => state.userData);

  const [loading, setLoading] = useState(false)

  const handleDeleteWord = async () => {
    setLoading(true)
    toast.loading('Deleting word...', {
      toastId: 'deleting-word'
    })
    try {
      await deleteWord(userData?.uid!)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
      closeDeleteWordModal()
      toast.dismiss('deleting-word')
    }
  }

  return (
    <>
      <Transition show={deleteWordModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={closeDeleteWordModal}
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
                    Delete Word
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete {wordsToDelete?.word}?
                    </p>
                  </div>

                  <div className="mt-4 flex items-center space-x-4">
                    <button
                      onClick={closeDeleteWordModal}
                      className="modalBtnPrev"
                    >
                      Cancel
                    </button>
                    <button
                      className="modalBtnNext"
                      onClick={handleDeleteWord}
                      disabled={loading}
                    >
                      Delete Word
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

export default DeleteWordModal;
