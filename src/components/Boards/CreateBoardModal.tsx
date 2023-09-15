'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import useUIStore from '@/store/uiStore';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Board } from '@/interfaces/Board';
import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';
import AddUsers from './AddUsers';
import UploadImage from '../Common/UploadImage';
import useImageUploadStore from '@/store/imageUploadStore';
import useAddUsersStore from '@/store/addUsersStore';
import { toast } from 'react-toastify';

const CreateBoardModal = () => {
  const [addBoardModalOpen, toggleAddBoardModal] = useUIStore((state) => [state.addBoardModalOpen, state.toggleAddBoardModal]);

  const [addBoard] = useBoardStore((state) => [state.addBoard]);
  const [userData] = useUserStore((state) => [state.userData]);
  const [image] = useImageUploadStore((state) => [state.image]);
  const [users] = useAddUsersStore((state) => [state.users]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Board>();

  const onSubmit: SubmitHandler<Board> = async (data) => {
    const board = {
      ...data,
      owner: userData?.uid!,
    }

    toast.loading('Creating Board...', {
      toastId: 'create-board',
    });

    try {
      await addBoard(board, users, image);
      toggleAddBoardModal();
      toast.success('Board created successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      toast.dismiss('create-board');
      reset();
    }
  };

  return (
    <Transition show={addBoardModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={toggleAddBoardModal}
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
                  Create New Board
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Please enter the details to create a new board.
                  </p>
                </div>

                <div className="pt-6 space-y-4">
                  <form className="space-y-4">
                    {/* Name  */}
                    <div>
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Name
                      </label>
                      <input
                        className={classNames(
                          'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
                          errors?.name ? 'border-red-500' : null
                        )}
                        type="text"
                        defaultValue={`${userData?.name}'s Board`}
                        {...register('name', {
                          required: 'Board name is required.',
                        })}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="name"
                        render={({ message }) => (
                          <p className="text-red-500 text-xs italic">{message}</p>
                        )}
                      />
                    </div>

                    {/* Description  */}
                    <div>
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="description"
                      >
                        Description (Optional)
                      </label>
                      <textarea
                        className={classNames(
                          'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
                          errors?.description ? 'border-red-500' : null
                        )}
                        {...register('description', {
                          maxLength: {
                            value: 200,
                            message: 'Description cannot be more than 200 characters.',
                          },
                        })}
                        placeholder="Enter a description for the Board."
                      />

                      <ErrorMessage
                        errors={errors}
                        name="description"
                        render={({ message }) => (
                          <p className="text-red-500 text-xs italic">{message}</p>
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
                  </form>


                  {/* Add Users  */}
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="description"
                    >
                      Users (Optional)
                    </label>

                    <AddUsers />
                  </div>
                </div>

                {/* Submit  */}
                <div className="mt-4 flex items-center space-x-4">
                  <button disabled={isSubmitting} onClick={toggleAddBoardModal} className="modalBtnPrev">
                    Cancel
                  </button>

                  <button disabled={isSubmitting} onClick={handleSubmit(onSubmit)} className="modalBtnNext">
                    Create Board
                  </button>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateBoardModal;
