'use client';
import { Board } from '@/interfaces/Board.d';
import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';
import { Dialog, Transition } from '@headlessui/react';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import { Fragment } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import useUIStore from '@/store/uiStore';
import UploadImage from '../Common/UploadImage';
import useImageUploadStore from '@/store/imageUploadStore';
type Props = {};

const EditBoardModal = (props: Props) => {
  const [editBoard, board] = useBoardStore((state) => [
    state.editBoard,
    state.board,
  ]);

  const [editBoardModalOpen, toggleEditBoardModal] = useUIStore((state) => [
    state.editBoardModalOpen,
    state.toggleEditBoardModal,
  ]);

  const [setPreviewImage] = useImageUploadStore((state) => [
    state.setPreviewImage,
  ]);

  const userData = useUserStore((state) => state.userData);
  const [image] = useImageUploadStore((state) => [state.image]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Board>();

  useEffect(() => {
    if (board) {
      reset(board);
      setPreviewImage(board.image);
    }

    return () => {
      setPreviewImage(undefined);
    };
  }, [board, setPreviewImage, reset]);

  const onSubmit: SubmitHandler<Board> = async (data) => {
    toast.loading('Updating board...', {
      toastId: 'update-board',
    });

    try {
      await editBoard(userData!, data, image);
      toast.success('Board updated successfully.');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      toggleEditBoardModal();
      toast.dismiss('update-board');
      reset();
    }
  };

  return (
    <>
      <Transition show={editBoardModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={toggleEditBoardModal}
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
                    Edit Board
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Edit the name, description and thumbnail of your board.
                      For adding new users please go to the users tab from the
                      board option.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="pt-6 space-y-4"
                  >
                    <div>
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Name
                      </label>
                      <input
                        className={classNames(
                          'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline',
                          errors?.name ? 'border-red-500' : null
                        )}
                        type="text"
                        {...register('name', {
                          required: 'Board name is required.',
                        })}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="name"
                        render={({ message }) => (
                          <p className="text-red-500 text-xs italic">
                            {message}
                          </p>
                        )}
                      />
                    </div>

                    {/* Upload Image  */}
                    <div className="">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="image"
                      >
                        Image (Optional)
                      </label>

                      <UploadImage />
                    </div>

                    {/* Description  */}
                    <div>
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="description"
                      >
                        Description
                      </label>
                      <textarea
                        className={classNames(
                          'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline',
                          errors?.description ? 'border-red-500' : null
                        )}
                        {...register('description', {
                          maxLength: {
                            value: 200,
                            message:
                              'Description cannot be more than 200 characters.',
                          },
                        })}
                        placeholder="Enter a description for the Board (Optional)"
                      />

                      <ErrorMessage
                        errors={errors}
                        name="description"
                        render={({ message }) => (
                          <p className="text-red-500 text-xs italic">
                            {message}
                          </p>
                        )}
                      />
                    </div>

                    <div className="mt-4 flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={toggleEditBoardModal}
                        className="modalBtnPrev"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="modalBtnNext"
                        disabled={isSubmitting}
                      >
                        Edit Board
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

export default EditBoardModal;
