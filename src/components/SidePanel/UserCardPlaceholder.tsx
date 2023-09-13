import React from 'react';


const UserCardPlaceholder = () => {
    return (
        <div className="relative flex items-center justify-between rounded-md p-3">
            <div className="flex items-center loading-placeholder space-x-2">
                <div className="rounded-full h-8 aspect-square bg-gray-300" />
                <div className="w-full">
                    <div className="bg-gray-200 w-1/2">
                        <div className="bar bg-gray-300 h-2" />
                    </div>
                    <ul className="mt-1 flex space-x-1 text-xs">
                        <li className='w-28 bg-gray-200'>
                            <div className="bar bg-gray-300 h-2" />
                        </li>
                        <li>&middot;</li>
                        <li className='w-14 bg-gray-200'>
                            <div className="bar bg-gray-300 h-2" />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserCardPlaceholder;
