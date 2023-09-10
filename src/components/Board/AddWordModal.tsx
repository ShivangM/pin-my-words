'use client';
import { RootWord, Word } from '@/interfaces/Word';
import useBoardStore from '@/store/boardStore';
import { Dialog, Transition } from '@headlessui/react';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import { Fragment, use, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';
import options from '@/constants/parts-of-speech.json';
import AsyncSelect from 'react-select/async';
import fetchRootWordsByBoardIdAndUserId from '@/lib/Root Words/fetchRootWords';
import debounce from 'lodash.debounce';
import { IoIosCloseCircle } from 'react-icons/io';
import Image from 'next/image';
import useUserStore from '@/store/userStore';
import { Timestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

const AddWordModal = () => {
  const [closeAddWordModal, addWordModalOpen, boardId, addWord] = useBoardStore(
    (state) => [state.closeAddWordModal, state.addWordModalOpen, state.board?._id, state.addWord]
  );

  const [userData] = useUserStore((state) => [state.userData]);
  const [addWordLoading, setAddWordLoading] = useState<boolean>(false)

  const { register, handleSubmit, control, formState: { errors } } = useForm<Word>();

  const promiseOptions = (inputValue: string, callback: (res: RootWord[]) => void) => {
    fetchRootWordsByBoardIdAndUserId(boardId!, userData?.uid!).then((res) => {
      callback(res);
    });
  };

  const loadOptions = debounce(promiseOptions, 300);

  const exampleRef = useRef<HTMLInputElement | null>(null);
  const [examples, setExamples] = useState<string[]>([])
  const addExample = () => {
    const value = exampleRef?.current?.value;
    if (!value) return;
    setExamples([...examples, value]);
    //@ts-ignore
    exampleRef.current.value = ""
  }

  const removeExample = (idx: number) => {
    setExamples(examples.splice(idx, 1));
  }

  // Image Upload and Preview
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File>()
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit: SubmitHandler<Word> = async (data) => {
    const wordData = {
      ...data,
      examples,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: userData?.uid!,
    }

    toast.loading('Adding word...', {
      toastId: 'add-word',
    });

    setAddWordLoading(true)

    try {
      await addWord(wordData, userData?.uid!, image);
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      toast.dismiss('add-word');
      setAddWordLoading(false)
      closeAddWordModal();
    }
  }

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

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className='space-y-3'>
                      <div>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="name"
                        >
                          Root Word(s)
                        </label>

                        <Controller
                          control={control}
                          name="roots"
                          rules={{ required: 'Root Word(s) is required.' }}
                          render={({ field: { onChange, ref } }) => (
                            <AsyncSelect
                              //@ts-ignore
                              inputRef={ref}
                              cacheOptions
                              loadOptions={loadOptions}
                              getOptionLabel={(option: RootWord) => option.root}
                              getOptionValue={(option: RootWord) => option._id}
                              onChange={(val) => onChange(val.map((c) => c._id))}
                              isMulti={true}
                            />
                          )}
                        />

                        <ErrorMessage
                          errors={errors}
                          name="roots"
                          render={({ message }) => (
                            <p className="text-red-500 text-xs italic">{message}</p>
                          )}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="name"
                        >
                          Word
                        </label>

                        <input
                          className={classNames(
                            'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
                            errors?.word ? 'border-red-500' : null
                          )}
                          type="text"
                          placeholder="Word"
                          {...register('word', {
                            required: 'Word is required.',
                          })}
                        />

                        <ErrorMessage
                          errors={errors}
                          name="word"
                          render={({ message }) => (
                            <p className="text-red-500 text-xs italic">{message}</p>
                          )}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="name"
                        >
                          Meaning
                        </label>

                        <input
                          className={classNames(
                            'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
                            errors?.word ? 'border-red-500' : null
                          )}
                          type="text"
                          placeholder="Word"
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
                          htmlFor="name"
                        >
                          Part(s) Of Speech
                        </label>

                        <Controller
                          control={control}
                          name="partOfSpeech"
                          rules={{ required: 'Parts of speech is required.' }}
                          render={({ field: { onChange, ref } }) => (
                            <Select
                              //@ts-ignore
                              inputRef={ref}
                              onChange={(val) => onChange(val.map((c) => c.value))}
                              isMulti={true}
                              options={options}
                            />
                          )}
                        />

                        <ErrorMessage
                          errors={errors}
                          name="partOfSpeech"
                          render={({ message }) => (
                            <p className="text-red-500 text-xs italic">{message}</p>
                          )}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="examples"
                        >
                          Examples (Optional)
                        </label>

                        <div
                          hidden={examples.length === 0}
                          className="flex flex-wrap w-full items-center gap-4"
                        >
                          {examples?.map((example, index) => (
                            <div
                              key={index}
                              className="flex bg-gray-50 rounded-full px-4 py-2 items-center gap-2"
                            >
                              <p className="text-sm text-gray-500">{example}</p>
                              <button
                                type='button'
                                onClick={() => {
                                  removeExample(index);
                                }}
                              >
                                <IoIosCloseCircle className="h-5 w-5 text-red-500" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center mt-2 space-x-2">
                          <input
                            className={classNames(
                              'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            )}
                            type="text"
                            ref={exampleRef}
                            placeholder="Write a exmaple over here..."
                          />

                          <button type='button' onClick={addExample} className="modalBtnNext">
                            +
                          </button>
                        </div>

                        <ErrorMessage
                          errors={errors}
                          name="examples"
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

                        <input hidden onChange={handleChange} ref={imageRef} type="file" />

                        <Image
                          src={previewImage || '/assets/board-placeholder.svg'}
                          onClick={() => imageRef?.current?.click()}
                          alt="Board Image"
                          width={500}
                          height={288}
                          className="object-cover cursor-pointer object-center w-full rounded-md"
                        />
                      </div>
                    </div>


                    <div className="mt-4 flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={closeAddWordModal}
                        className="modalBtnPrev"
                        disabled={addWordLoading}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="modalBtnNext"
                        disabled={addWordLoading}
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
