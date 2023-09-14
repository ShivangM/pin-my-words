'use client';
import useBoardStore from '@/store/boardStore';
import useUIStore from '@/store/uiStore';
import useUserStore from '@/store/userStore';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
type Props = {};

const DeleteWordModal = (props: Props) => {
  const [deleteWord] =
    useBoardStore((state) => [
      state.deleteWord,
    ]);

  const [deleteWordModalOpen, toggleDeleteWordModal, focusedWord] = useUIStore(state => [state.deleteWordModalOpen, state.toggleDeleteWordModal, state.focusedWord])

  const userData = useUserStore((state) => state.userData);
  const [deleteWordLoading, setDeleteWordLoading] = useState<boolean>(false)

  const handleDeleteWord = async () => {
    if (!focusedWord) return

    setDeleteWordLoading(true)
    toast.loading('Deleting word...', {
      toastId: 'deleting-word'
    })
    try {
      await deleteWord(focusedWord!, userData!)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setDeleteWordLoading(false)
      toggleDeleteWordModal(null)
      toast.dismiss('deleting-word')
    }
  }

  return (
    <>
      <Transition show={deleteWordModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => toggleDeleteWordModal(null)}
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
                      Are you sure you want to delete <span className='font-bold'>{focusedWord?.word}</span>?
                    </p>
                  </div>

                  <div className="mt-4 flex items-center space-x-4">
                    <button
                      onClick={() => toggleDeleteWordModal(null)}
                      className="modalBtnPrev"
                      disabled={deleteWordLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className="modalBtnNext"
                      onClick={handleDeleteWord}
                      disabled={deleteWordLoading}
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
