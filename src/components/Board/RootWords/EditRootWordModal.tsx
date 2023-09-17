'use client';
import { RootWord } from '@/interfaces/Word';
import useBoardStore from '@/store/boardStore';
import { Dialog, Transition } from '@headlessui/react';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import { Fragment, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';
import options from '@/constants/parts-of-speech.json';
import useUserStore from '@/store/userStore';
import { toast } from 'react-toastify';
import useUIStore from '@/store/uiStore';

const EditRootWordModal = () => {
  const [editRootWord] = useBoardStore(state => [state.editRootWord, state.rootWords]);
  const [editRootWordModalOpen, toggleEditRootWordModal, focusedRootWord] = useUIStore(state => [state.editRootWordModalOpen, state.toggleEditRootWordModal, state.focusedRootWord]);

  const [userData] = useUserStore((state) => [state.userData]);
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<RootWord>();

  const onSubmit: SubmitHandler<RootWord> = async (data) => {
    const wordData: RootWord = {
      ...data,
      root: data.root.toLowerCase(),
      _id: focusedRootWord?._id!,
    }

    toast.loading('Updating root word...', {
      toastId: 'edit-root-word',
    });

    try {
      await editRootWord(wordData, userData!);
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      toast.dismiss('edit-root-word');
      toggleEditRootWordModal(null);
      reset();
    }
  }

  useEffect(() => {
    if (focusedRootWord) {
      reset(focusedRootWord)
    }
  }, [focusedRootWord])

  return (
    <>
      <Transition show={editRootWordModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => toggleEditRootWordModal(null)}>
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
                      Edit Root Word {focusedRootWord?.root}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Edit this root word to update meaning, description.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className='space-y-3'>
                      <div>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="type"
                        >
                          Type
                        </label>

                        <Controller
                          control={control}
                          name="type"
                          rules={{ required: 'Type is required.' }}
                          render={({ field: { onChange, ref } }) => (
                            <Select
                              //@ts-ignore
                              inputRef={ref}
                              onChange={(val) => onChange(val?.value)}
                              defaultValue={{ value: focusedRootWord?.type, label: focusedRootWord?.type }}
                              options={options}
                              isSearchable={false}
                            />
                          )}
                        />

                        <ErrorMessage
                          errors={errors}
                          name="type"
                          render={({ message }) => (
                            <p className="text-red-500 text-xs italic">{message}</p>
                          )}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="root"
                        >
                          Root Word
                        </label>

                        <input
                          className={classNames(
                            'shadow appearance-none border rounded disabled:cursor-not-allowed w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
                            errors?.root ? 'border-red-500' : null
                          )}
                          type="text"
                          placeholder="Root Word"
                          {...register('root', {
                            required: 'Root Word is required.',
                            validate: (value) => {
                              return /^[a-zA-Z]+$/.test(value) || 'Root word must be a single word.'
                            },
                            disabled: true,
                          })}
                        />

                        <ErrorMessage
                          errors={errors}
                          name="root"
                          render={({ message }) => (
                            <p className="text-red-500 text-xs italic">{message}</p>
                          )}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="meaning"
                        >
                          Meaning
                        </label>

                        <input
                          className={classNames(
                            'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
                            errors?.meaning ? 'border-red-500' : null
                          )}
                          type="text"
                          placeholder="Meaning"
                          {...register('meaning', {
                            required: 'Meaning is required.',
                          })}
                        />

                        <ErrorMessage
                          errors={errors}
                          name="meaning"
                          render={({ message }) => (
                            <p className="text-red-500 text-xs italic">{message}</p>
                          )}
                        />
                      </div>

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
                          placeholder="Description"
                          {...register('description')}
                        >
                        </textarea>

                        <ErrorMessage
                          errors={errors}
                          name="description"
                          render={({ message }) => (
                            <p className="text-red-500 text-xs italic">{message}</p>
                          )}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => toggleEditRootWordModal(null)}
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
                        Edit Root Word
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

export default EditRootWordModal;
