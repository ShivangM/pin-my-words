'use client';
import useBoardStore from '@/store/boardStore';
import useUIStore from '@/store/uiStore';
import useUserStore from '@/store/userStore';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
type Props = {};

const LeaveBoardModal = (props: Props) => {
    const [leaveBoard] = useBoardStore((state) => [state.leaveBoard]);
    const [leaveBoardModalOpen, toggleLeaveBoardModal] = useUIStore(state => [state.leaveBoardModalOpen, state.toggleLeaveBoardModal])

    const userData = useUserStore((state) => state.userData);
    const [leaveBoardLoading, setLeaveBoardLoading] = useState<boolean>(false)
    const router = useRouter();

    const handleLeaveBoard = async () => {
        setLeaveBoardLoading(true);
        toast.loading('Leaving board...', {
            toastId: 'leave-board',
        });

        try {
            await leaveBoard(userData!);
            router.push('/boards');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLeaveBoardLoading(false);
            toggleLeaveBoardModal();
            toast.dismiss('leave-board');
        }
    };
    return (
        <>
            <Transition show={leaveBoardModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={toggleLeaveBoardModal}
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
                                            Leave Board
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to leave this board?
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center space-x-4">
                                        <button
                                            onClick={toggleLeaveBoardModal}
                                            className="modalBtnPrev"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleLeaveBoard}
                                            className="modalBtnNext"
                                            disabled={leaveBoardLoading}
                                        >
                                            Leave Board
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

export default LeaveBoardModal;
