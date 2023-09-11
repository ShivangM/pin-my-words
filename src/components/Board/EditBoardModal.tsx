'use client';
import { Metadata } from '@/interfaces/Board.d';
import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';
import { Dialog, Transition } from '@headlessui/react';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import Image from 'next/image';
import { Fragment, useState } from 'react';
import { SubmitHandler, set, useForm } from 'react-hook-form';
import { useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
type Props = {};

const EditBoardModal = (props: Props) => {
  const [
    editBoard,
    closeEditBoardModal,
    editBoardModalOpen,
    board,
  ] = useBoardStore((state) => [
    state.editBoard,
    state.closeEditBoardModal,
    state.editBoardModalOpen,
    state.board,
  ]);

  const userData = useUserStore((state) => state.userData);

  // Image Upload and Preview
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File>()
  const [previewImage, setPreviewImage] = useState<string>()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<Metadata>();

  useEffect(() => {
    if (board) {
      reset(board.metadata)
      setPreviewImage(board.metadata.image)
    }
  }, [board])

  const onSubmit: SubmitHandler<Metadata> = async (data) => {
    toast.loading('Updating board...', {
      toastId: 'update-board',
    });

    try {
      await editBoard(userData?.uid!, data, image);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      closeEditBoardModal();
      toast.dismiss('update-board');
      setImage(undefined)
      reset()
      setPreviewImage(undefined)
    }
  };

  return (
    <>
      <Transition show={editBoardModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={closeEditBoardModal}
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

                      <input
                        hidden
                        onChange={handleChange}
                        ref={imageRef}
                        type="file"
                      />

                      <Image
                        src={
                          previewImage ||
                          '/assets/board-placeholder.svg'
                        }
                        onClick={() => imageRef?.current?.click()}
                        alt="Board Image"
                        width={500}
                        height={288}
                        className="object-cover cursor-pointer object-center w-full rounded-md"
                      />
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
                        onClick={closeEditBoardModal}
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
