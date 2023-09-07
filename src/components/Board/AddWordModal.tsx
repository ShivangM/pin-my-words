'use client';
import useAddWord from '@/hooks/useAddWord';
import { AddWordSteps } from '@/interfaces/Word.d';
import useBoardStore from '@/store/boardStore';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import EnterDetails from './AddWordSteps/EnterDetails';
import EnterExamples from './AddWordSteps/EnterExamples';
import EnterImage from './AddWordSteps/EnterImage';

const AddWordModal = () => {
  const [closeAddWordModal, addWordModalOpen, loading] = useBoardStore(
    (state) => [state.closeAddWordModal, state.addWordModalOpen, state.loading]
  );

  const { handleSubmit, onSubmit, addWordStep } = useAddWord();

  const AddWordStep = () => {
    switch (addWordStep) {
      case AddWordSteps.ENTER_DETAILS:
        return <EnterDetails />;
      case AddWordSteps.ENTER_EXAMPLES:
        return <EnterExamples />;
      case AddWordSteps.ENTER_IMAGE:
        return <EnterImage />;
      default:
        return <EnterDetails />;
    }
  };

  return (
    <>
      <Transition show={addWordModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeAddWordModal}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl space-y-6 transition-all">
                  <div className="">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Add Word To Board
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Add a word to this board.
                      </p>
                    </div>
                  </div>

                  <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <AddWordStep />

                    <div className="mt-4 flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={closeAddWordModal}
                        className="modalBtnPrev"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="modalBtnNext"
                        disabled={loading}
                      >
                        Add Word
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AddWordModal;
