'use client';
import { Word } from '@/interfaces/Word';
import useBoardStore from '@/store/boardStore';
import { Dialog, Transition } from '@headlessui/react';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import options from '@/constants/parts-of-speech.json';
import { IoIosCloseCircle } from 'react-icons/io';
import useUserStore from '@/store/userStore';
import { toast } from 'react-toastify';
import useUIStore from '@/store/uiStore';
import UploadImage from '../../Common/UploadImage';
import useImageUploadStore from '@/store/imageUploadStore';
import fetchRootsBySearchTerm from '@/lib/Root Words/fetchRootsBySearchTerm';
import debounce from 'lodash.debounce';

const EditWordModal = () => {
  const [editWord, rootWords, board] = useBoardStore((state) => [
    state.editWord,
    state.rootWords,
    state.board,
  ]);
  const [editWordModalOpen, toggleEditWordModal, focusedWord] = useUIStore(
    (state) => [
      state.editWordModalOpen,
      state.toggleEditWordModal,
      state.focusedWord,
    ]
  );

  const [userData] = useUserStore((state) => [state.userData]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Word>();

  useEffect(() => {
    if (focusedWord) {
      reset(focusedWord);
      setExamples(focusedWord.examples || []);
    }
  }, [focusedWord]);

  //Example
  const exampleRef = useRef<HTMLInputElement | null>(null);
  const [examples, setExamples] = useState<string[]>([]);

  const addExample = () => {
    const value = exampleRef?.current?.value;
    if (!value) return;
    setExamples([...examples, value]);
    //@ts-ignore
    exampleRef.current.value = '';
  };

  const removeExample = (idx: number) => {
    setExamples(examples.filter((_, index) => index !== idx));
  };

  const [image] = useImageUploadStore((state) => [state.image]);

  const onSubmit: SubmitHandler<Word> = async (data) => {
    const wordData: Word = {
      ...data,
      word: data.word.toLowerCase(),
      _id: focusedWord?._id!,
      examples,
    };

    toast.loading('Updating word...', {
      toastId: 'edit-word',
    });

    try {
      await editWord(wordData, userData!, image);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      toast.dismiss('edit-word');
      toggleEditWordModal(null);
      reset();
    }
  };

  const [setPreviewImage] = useImageUploadStore((state) => [
    state.setPreviewImage,
  ]);

  useEffect(() => {
    if (focusedWord?.image) {
      setPreviewImage(focusedWord.image);
    }

    return () => {
      setPreviewImage(undefined);
    };
  }, [focusedWord, setPreviewImage]);

  const promiseOptions = (
    inputValue: string,
    callback: (res: { label: string; value: string }[]) => void
  ) => {
    try {
      fetchRootsBySearchTerm(inputValue, board?._id!).then((res) => {
        const options = res.map((root) => ({
          value: root._id,
          label: root.root,
        }));
        callback(options);
      });
    } catch (error) {
      //To-Do: Handle error
    }
  };

  const loadOptions = debounce(promiseOptions, 300);

  return (
    <>
      <Transition show={editWordModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => toggleEditWordModal(null)}
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl space-y-6 transition-all">
                  <div className="">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Edit Word {focusedWord?.word}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Edit this word to update image, meaning, examples, etc.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-3">
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
                          // rules={{ required: 'Root Word(s) is required.' }}
                          render={({ field: { onChange, ref } }) => (
                            <AsyncSelect
                              //@ts-ignore
                              inputRef={ref}
                              loadOptions={loadOptions}
                              defaultValue={focusedWord?.roots}
                              onChange={(val) => onChange(val.map((c) => c))}
                              isMulti={true}
                              components={{}}
                            />
                          )}
                        />

                        <ErrorMessage
                          errors={errors}
                          name="roots"
                          render={({ message }) => (
                            <p className="text-red-500 text-xs italic">
                              {message}
                            </p>
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
                            <p className="text-red-500 text-xs italic">
                              {message}
                            </p>
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
                            <p className="text-red-500 text-xs italic">
                              {message}
                            </p>
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
                          rules={{ required: 'Part(s) Of Speech is required.' }}
                          render={({ field: { onChange, ref } }) => (
                            <Select
                              //@ts-ignore
                              inputRef={ref}
                              defaultValue={focusedWord?.partOfSpeech?.map(
                                (pos) => ({ label: pos, value: pos })
                              )}
                              onChange={(pos) =>
                                onChange(pos.map((c) => c.value))
                              }
                              getOptionLabel={(option) => option.label}
                              getOptionValue={(option) => option.value}
                              isMulti={true}
                              options={options}
                            />
                          )}
                        />

                        <ErrorMessage
                          errors={errors}
                          name="partOfSpeech"
                          render={({ message }) => (
                            <p className="text-red-500 text-xs italic">
                              {message}
                            </p>
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
                                type="button"
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

                          <button
                            type="button"
                            onClick={addExample}
                            className="modalBtnNext"
                          >
                            +
                          </button>
                        </div>

                        <ErrorMessage
                          errors={errors}
                          name="examples"
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
                    </div>

                    <div className="mt-4 flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => toggleEditWordModal(null)}
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
                        Edit Word
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

export default EditWordModal;
