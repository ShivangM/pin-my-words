'use client';
import useBoardStore from '@/store/boardStore';
import useUIStore from '@/store/uiStore';
import useUserStore from '@/store/userStore';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
type Props = {};

const RemoveUserModal = (props: Props) => {
    const [removeUser] =
        useBoardStore((state) => [
            state.removeUser,
        ]);

    const [removeUserModalOpen, toggleRemoveUserModal, focusedUser] = useUIStore(state => [state.removeUserModalOpen, state.toggleRemoveUserModal, state.focusedUser])

    const userData = useUserStore((state) => state.userData);
    const [removeUserLoading, setRemoveUserLoading] = useState<boolean>(false)

    const handleRemoveUser = async () => {
        if (!focusedUser) return

        setRemoveUserLoading(true)
        toast.loading('Removing user...', {
            toastId: 'remove-user'
        })
        try {
            await removeUser(focusedUser, userData!)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setRemoveUserLoading(false)
            toggleRemoveUserModal(null)
            toast.dismiss('remove-user')
        }
    }

    return (
        <>
            <Transition show={removeUserModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => toggleRemoveUserModal(null)}
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
                                            Remove User
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to remove <span className='font-bold'>{focusedUser?.name}</span>?
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center space-x-4">
                                        <button
                                            onClick={() => toggleRemoveUserModal(null)}
                                            className="modalBtnPrev"
                                            disabled={removeUserLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="modalBtnNext"
                                            onClick={handleRemoveUser}
                                            disabled={removeUserLoading}
                                        >
                                            Remove User
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default RemoveUserModal;
