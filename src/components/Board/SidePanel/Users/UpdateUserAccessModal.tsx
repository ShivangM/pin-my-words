'use client';
import { BoardAccess } from '@/interfaces/Board.d';
import { User } from '@/interfaces/User';
import useBoardStore from '@/store/boardStore';
import useUIStore from '@/store/uiStore';
import useUserStore from '@/store/userStore';
import { Dialog, Transition } from '@headlessui/react';
import { ErrorMessage } from '@hookform/error-message';
import { Fragment } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'react-toastify';
type Props = {};

const UpdateUserAccessModal = (props: Props) => {
    const [updateAccess] = useBoardStore((state) => [state.updateAccess]);
    const [updateUserAccessModalOpen, toggleUpdateUserAccessModal, focusedUser] = useUIStore(state => [state.updateUserAccessModalOpen, state.toggleUpdateUserAccessModal, state.focusedUser])

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        reset,
    } = useForm<{
        user: User;
        access: BoardAccess;
    }>();

    const userData = useUserStore((state) => state.userData);

    const handleUpdateUserAccess: SubmitHandler<{
        access: BoardAccess;
    }> = async ({ access }) => {
        if (!focusedUser) return

        toast.loading('Updating user access...', {
            toastId: 'add-user',
        });

        try {
            await updateAccess(focusedUser, userData!, access)
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            toggleUpdateUserAccessModal(null);
            reset();
            toast.dismiss('add-user');
        }
    };

    const accessOptions = [
        { value: BoardAccess.READ_ONLY, label: 'Read Only' },
        { value: BoardAccess.READ_WRITE, label: 'Read & Write' },
        { value: BoardAccess.ADMIN, label: 'Admin' },
    ];

    return (
        <>
            <Transition show={updateUserAccessModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => toggleUpdateUserAccessModal(null)}
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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 space-y-6 text-left align-middle shadow-xl transition-all">
                                    <div className="">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            Update User Access
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Update the access for <span className='font-semibold' >{focusedUser?.name}</span>.
                                            </p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit(handleUpdateUserAccess)}>
                                        <div className="">
                                            <Controller
                                                control={control}
                                                name="access"
                                                rules={{
                                                    required: 'Access is required.', validate: (val) => {
                                                        if (val === focusedUser?.access) return "Access must be different from the user's current access."
                                                    }
                                                }}
                                                defaultValue={BoardAccess.READ_ONLY}
                                                render={({ field: { onChange, ref } }) => (
                                                    <Select
                                                        //@ts-ignore
                                                        inputRef={ref}
                                                        defaultValue={accessOptions[0]}
                                                        onChange={(val) => onChange(val?.value)}
                                                        options={accessOptions}
                                                        isSearchable={false}
                                                        menuPlacement='top'
                                                    />
                                                )}
                                            />

                                            <ErrorMessage
                                                errors={errors}
                                                name="access"
                                                render={({ message }) => (
                                                    <p className="text-red-500 text-xs italic">{message}</p>
                                                )}
                                            />
                                        </div>

                                        <div className="mt-4 flex items-center space-x-4">
                                            <button
                                                onClick={() => toggleUpdateUserAccessModal(null)}
                                                className="modalBtnPrev"
                                                type='button'
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type='submit'
                                                className="modalBtnNext"
                                                disabled={isSubmitting}
                                            >
                                                Update User Access
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

export default UpdateUserAccessModal;
