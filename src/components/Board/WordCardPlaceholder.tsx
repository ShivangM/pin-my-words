// LoadingWordsCardPlaceholder.tsx
import React from 'react';
import classNames from 'classnames';
import { BiSolidEdit } from 'react-icons/bi';
import { AiFillDelete } from 'react-icons/ai';
import { BoardAccess } from '@/interfaces/Board.d';
import useBoardStore from '@/store/boardStore';
import { HiMiniSpeakerWave } from 'react-icons/hi2';

const LoadingWordsCardPlaceholder = ({ idx }: { idx: number }) => {
    const [userAccess] = useBoardStore((state) => [state.userAccess]);
    return (
        <div
            className={classNames(
                'flex flex-col overflow-hidden bg-gray-100 rounded-md shadow-sm loading-placeholder',
                idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
            )}
        >
            <div className="relative h-80 aspect-square">
                {/* Image Loading Animation */}
                <div className="image-loading-animation"></div>
            </div>

            <div className="flex flex-col relative justify-center space-y-6 flex-1 p-6">
                {/* Edit and Delete Icons */}
                {
                    userAccess === BoardAccess.READ_ONLY ? null
                        :
                        <div className="w-fit flex items-center space-x-2 absolute top-4 right-4">
                            <BiSolidEdit
                                className="w-6 h-6 cursor-pointer text-gray-700"
                            />
                            <AiFillDelete
                                className="w-6 h-6 cursor-pointer text-red-500"
                            />
                        </div>
                }

                <div className="">
                    <div className="bg-gray-200 w-40">
                        <div className="bar bg-gray-300 h-3"></div>
                    </div>
                    <h3 className="space-x-2 flex items-center">
                        <div className="bg-gray-200 w-80">
                            <div className="bar bg-gray-300 h-5"></div>
                        </div>
                        <HiMiniSpeakerWave className='inline text-3xl text-gray-400 cursor-pointer' />
                    </h3>
                    <div className=" bg-gray-200 w-60">
                        <div className="bar bg-gray-300 h-3"></div>
                    </div>
                </div>

                <div className="space-y-1">
                    <h4 className="text-sm font-bold">Root Word(s):</h4>
                    <ul className="space-x-2 text-sm text-gray-900 font-medium cursor-pointer list-inside list-none flex items-center">
                        {/* Loading bar bg-gray-300 s for Roots */}
                        <li className="w-16 py-0.5 transition-all ease-in-out duration-300  hover:bg-gray-300 bg-gray-200 rounded-lg">
                            <div className="bar bg-gray-300 h-3"></div>
                        </li>
                        <li className="w-12 py-0.5 transition-all ease-in-out duration-300  hover:bg-gray-300 bg-gray-200 rounded-lg">
                            <div className="bar bg-gray-300 h-3"></div>
                        </li>
                        <li className="w-14 py-0.5 transition-all ease-in-out duration-300  hover:bg-gray-300 bg-gray-200 rounded-lg">
                            <div className="bar bg-gray-300 h-3"></div>
                        </li>
                    </ul>
                </div>

                <div className="space-y-1">
                    <h4 className="text-sm font-bold">Examples:</h4>
                    <ol className="space-y-1 text-sm text-gray-500 list-inside list-decimal">
                        <li className="space-x-1">
                            {/* Loading bar bg-gray-300 s for Examples */}
                            <div className="bg-gray-200 inline-block w-80">
                                <div className="bar bg-gray-300 h-2"></div>
                            </div>
                        </li>
                        <li className="space-x-1">
                            {/* Loading bar bg-gray-300 s for Examples */}
                            <div className="bg-gray-200 inline-block w-64">
                                <div className="bar bg-gray-300 h-2"></div>
                            </div>
                        </li>
                        <li className="space-x-1">
                            {/* Loading bar bg-gray-300 s for Examples */}
                            <div className="bg-gray-200 inline-block w-72">
                                <div className="bar bg-gray-300 h-2"></div>
                            </div>
                        </li>
                    </ol>
                </div>

                <button
                    type="button"
                    className="modalBtn bg-slate-200 hover:bg-slate-300 w-fit"
                >
                    View More
                </button>
            </div>
        </div>
    );
};

export default LoadingWordsCardPlaceholder;
