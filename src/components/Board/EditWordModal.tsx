'use client';
import { Word } from '@/interfaces/Word';
import useBoardStore from '@/store/boardStore';
import { Dialog, Transition } from '@headlessui/react';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';
import options from '@/constants/parts-of-speech.json';
import { IoIosCloseCircle } from 'react-icons/io';
import Image from 'next/image';
import useUserStore from '@/store/userStore';
import { Timestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

const EditWordModal = () => {
  const [closeEditWordModal, editWordModalOpen, editWord, focusedWord, rootWords] = useBoardStore(state => [state.closeEditWordModal, state.editWordModalOpen, state.editWord, state.focusedWord, state.rootWords]
  );

  const [userData] = useUserStore((state) => [state.userData]);
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<Word>();


  useEffect(() => {
    if (focusedWord) {
      reset(focusedWord)
      setExamples(focusedWord.examples || [])
      setPreviewImage(focusedWord.image)
    }
  }, [focusedWord])

  //Example
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
    setExamples(examples.filter((_, index) => index !== idx));
  }

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

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData.files.length > 0) {
      const file = e.clipboardData.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  }

  // drag state
  const [dragActive, setDragActive] = useState(false);

  // handle drag events
  const handleDrag = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  }

  const resetImage = () => {
    setImage(undefined);
    setPreviewImage(undefined);
  }

  const onSubmit: SubmitHandler<Word> = async (data) => {
    const wordData: Word = {
      ...data,
      word: data.word.toLowerCase(),
      _id: focusedWord?._id!,
      examples,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: userData?.uid!,
    }

    toast.loading('Updating word...', {
      toastId: 'edit-word',
    });

    try {
      await editWord(wordData, userData?.uid!, image);
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      toast.dismiss('edit-word');
      closeEditWordModal();
      reset();
    }
  }

  return (
    <>
      <Transition show={editWordModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeEditWordModal}>
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
                          // rules={{ required: 'Root Word(s) is required.' }}
                          render={({ field: { onChange, ref } }) => (
                            <Select
                              //@ts-ignore
                              inputRef={ref}
                              defaultValue={focusedWord?.roots || undefined}
                              options={rootWords?.map((rootWord) => { return { label: rootWord.root, value: rootWord._id } }) || undefined}
                              onChange={(val) => onChange(val.map((c) => c))}
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
                          rules={{ required: 'Part(s) Of Speech is required.' }}
                          render={({ field: { onChange, ref } }) => (
                            <Select
                              //@ts-ignore
                              inputRef={ref}
                              defaultValue={focusedWord?.partOfSpeech?.map((pos) => ({ label: pos, value: pos }))}
                              onChange={(pos) => onChange(pos.map((c) => c.value))}
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

                        <div onPaste={handlePaste} onDragEnter={handleDrag} onDragLeave={() => setDragActive(false)} onDrop={handleDrop} className={classNames("border-2 space-y-3 rounded-md border-dashed p-4 flex flex-col items-center justify-center focus:border-gray-600 transition-all ease-in-out duration-300", dragActive ? "border-brand" : "border-gray-500")}>
                          <Image
                            src={previewImage || '/assets/board-placeholder.svg'}
                            onClick={() => imageRef?.current?.click()}
                            alt="Board Image"
                            width={500}
                            height={288}
                            className="object-cover cursor-pointer object-center w-full rounded-md"
                          />
                          <p className='text-sm text-gray-900' >Add image by selecting, or paste it.</p>
                          <button type='button' onClick={resetImage} className='modalBtnPrev text-sm' >Reset</button>
                        </div>
                      </div>
                    </div>


                    <div className="mt-4 flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={closeEditWordModal}
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
