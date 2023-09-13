'use client';
import { BoardAccess, BoardUser } from '@/interfaces/Board';
import { User } from '@/interfaces/User';
import useBoardStore from '@/store/boardStore';
import useUIStore from '@/store/uiStore';
import useUserStore from '@/store/userStore';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
type Props = {};

const AddUserModal = (props: Props) => {
    const [addUser] = useBoardStore((state) => [state.addUser]);
    const [addUserModalOpen, toggleAddUserModal] = useUIStore(state => [state.addUserModalOpen, state.toggleAddUserModal])

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<{
        user: User;
        access: BoardAccess;
    }>();

    const userData = useUserStore((state) => state.userData);
    const [addUserLoading, setAddUserLoading] = useState<boolean>(false)

    const handleAddUser: SubmitHandler<{
        user: User;
        access: BoardAccess;
    }> = async (data) => {
        setAddUserLoading(true);
        toast.loading('Adding user to board...', {
            toastId: 'add-user',
        });

        const boardUser: BoardUser = {
            ...data.user,
            access: data.access,
        }

        try {
            await addUser(boardUser, userData?.uid!);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setAddUserLoading(false);
            toggleAddUserModal();
            toast.dismiss('add-user');
        }
    };

    return (
        <>
            <Transition show={addUserModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={toggleAddUserModal}
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
                                        Add User
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Add a user to this board
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit(handleAddUser)}>

                                        <div className="mt-4 flex items-center space-x-4">
                                            <button
                                                onClick={toggleAddUserModal}
                                                className="modalBtnPrev"
                                                type='button'
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type='submit'
                                                className="modalBtnNext"
                                                disabled={addUserLoading}
                                            >
                                                Add User
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

export default AddUserModal;
