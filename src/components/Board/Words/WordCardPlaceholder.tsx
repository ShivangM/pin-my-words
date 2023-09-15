// LoadingWordsCardPlaceholder.tsx
import React from 'react';
import classNames from 'classnames';
import { HiMiniSpeakerWave } from 'react-icons/hi2';

const WordsCardPlaceholder = ({ idx }: { idx: number }) => {
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
                <div className="flex items-center justify-between">
                    <p className='bg-gray-200 w-32' >
                        <div className="bar bg-gray-300 h-2"></div>
                    </p>
                </div>

                <div className="">
                    <div className="bg-gray-200 w-40">
                        <div className="bar bg-gray-300 h-3"></div>
                    </div>
                    <h3 className="space-x-2 flex items-center">
                        <div className="bg-gray-200 w-80">
                            <div className="bar bg-gray-300 h-5"></div>
                        </div>
                        <HiMiniSpeakerWave className='inline text-3xl text-gray-400' />
                    </h3>
                    <div className=" bg-gray-200 w-60">
                        <div className="bar bg-gray-300 h-3"></div>
                    </div>
                </div>

                <div className="space-y-1">
                    <h4 className="w-20 bg-gray-200 ">
                        <div className="bar bg-gray-300 h-3"></div>
                    </h4>
                    <ul className="space-x-2 list-inside list-none flex items-center">
                        {/* Loading bar bg-gray-300 s for Roots */}
                        <li className="w-16 py-0.5 bg-gray-200 rounded-lg">
                            <div className="bar bg-gray-300 h-3"></div>
                        </li>
                        <li className="w-12 py-0.5 bg-gray-200 rounded-lg">
                            <div className="bar bg-gray-300 h-3"></div>
                        </li>
                        <li className="w-14 py-0.5 bg-gray-200 rounded-lg">
                            <div className="bar bg-gray-300 h-3"></div>
                        </li>
                    </ul>
                </div>

                <div
                    className="bg-gray-200 w-20 h-8"
                >
                </div>
            </div>
        </div>
    );
};

export default WordsCardPlaceholder;
