'use client';
import { RootWord } from '@/interfaces/Word';
import useBoardStore from '@/store/boardStore';
import { Dialog, Transition } from '@headlessui/react';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import { Fragment } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import useUserStore from '@/store/userStore';
import { Timestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import Select from 'react-select';
import options from '@/constants/root-word-types.json';
import useUIStore from '@/store/uiStore';

const AddRootWordModal = () => {
    const [addRootWord] = useBoardStore(
        (state) => [state.addRootWord]
    );

    const [addRootWordModalOpen, toggleAddRootWordModal] = useUIStore(state => [state.addRootWordModalOpen, state.toggleAddRootWordModal])

    const [userData] = useUserStore((state) => [state.userData]);
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, control } = useForm<RootWord>();

    const onSubmit: SubmitHandler<RootWord> = async (data) => {
        const rootWordData = {
            ...data,
            root: data.root.toLowerCase(),
        }

        toast.loading('Adding root word...', {
            toastId: 'add-rootword',
        });

        try {
            await addRootWord(rootWordData, userData!);
            toast.success('Root word added successfully.')
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            toast.dismiss('add-rootword');
            toggleAddRootWordModal();
            reset();
        }
    }

    return (
        <>
            <Transition show={addRootWordModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={toggleAddRootWordModal}>
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
                                            Add Root Word To Board
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Add a root word to this board.
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
                                                        'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
                                                        errors?.root ? 'border-red-500' : null
                                                    )}
                                                    type="text"
                                                    placeholder="Root Word"
                                                    {...register('root', {
                                                        required: 'Root Word is required.',
                                                        validate: (value) => {
                                                            return /^[a-zA-Z]+$/.test(value) || 'Root word must be a single word.'
                                                        }
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
                                                />

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
                                                onClick={toggleAddRootWordModal}
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
                                                Add Root Word
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

export default AddRootWordModal;
