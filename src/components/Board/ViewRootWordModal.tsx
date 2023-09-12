'use client';
import useBoardStore from '@/store/boardStore';
import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import moment from 'moment';
import { Fragment } from 'react';
import { BiTimeFive } from 'react-icons/bi';
import { HiMiniSpeakerWave } from 'react-icons/hi2';
import { MdUpdate } from 'react-icons/md';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { RootWord } from '@/interfaces/Word';
type Props = {};

const ViewRootWordModal = (props: Props) => {
    const [closeViewRootWordModal, viewRootWordModalOpen, focusedRootWord] =
        useBoardStore((state) => [
            state.closeViewRootWordModal,
            state.viewRootWordModalOpen,
            state.focusedRootWord,
        ]);

    return (
        <>
            <Transition show={viewRootWordModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={closeViewRootWordModal}
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
                                    <div className="flex flex-col relative justify-center space-y-6 flex-1">
                                        <div className="">
                                            <span className="text-xs uppercase">{focusedRootWord?.type}</span>
                                            <h3 className="text-3xl font-bold space-x-2">
                                                <span>{focusedRootWord?.root}</span>
                                            </h3>
                                            <p className="">{focusedRootWord?.meaning}</p>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-1">
                                                <BiTimeFive className="text-xl" />
                                                <time className="text-gray-500 flex flex-col text-sm">
                                                    <span className="font-semibold text-gray-900">Created At: </span>
                                                    <span className='whitespace-nowrap' >
                                                        {moment(focusedRootWord?.createdAt?.toDate()).format('MMM Do YYYY')}
                                                    </span>
                                                </time>
                                            </div>

                                            <div className="flex items-center space-x-1">
                                                <MdUpdate className="text-xl" />
                                                <time className="text-gray-500 flex flex-col text-sm">
                                                    <span className="font-semibold text-gray-900">Updated At: </span>
                                                    <span className='whitespace-nowrap' >
                                                        {moment(focusedRootWord?.updatedAt.toDate()).format('MMMM Do YYYY')}
                                                    </span>
                                                </time>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold">Description: </h4>
                                            <p>{focusedRootWord?.meaning}</p>
                                        </div>
                                    </div>


                                    <div className="mt-4 flex items-center space-x-4">
                                        <button
                                            onClick={closeViewRootWordModal}
                                            className="modalBtnPrev"
                                        >
                                            Close
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

export default ViewRootWordModal;
