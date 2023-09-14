import React from 'react';


const UserCardPlaceholder = () => {
    return (
        <div className="relative bg-white rounded-lg shadow flex items-center justify-between p-3 animate-pulse">
            <div className="flex items-center loading-placeholder space-x-2">
                <div className="rounded-full h-8 aspect-square bg-gray-300" />
                <div className="w-full">
                    <div className="bg-gray-200 w-1/2">
                        <div className="bar bg-gray-300 h-2" />
                    </div>
                    <div className="mt-1 flex space-x-1 text-xs">
                        <div className='w-28 bg-gray-200 h-fit'>
                            <div className="bar bg-gray-300 h-2" />
                        </div>
                        <div>&middot;</div>
                        <div className='w-14 bg-gray-200 h-fit'>
                            <div className="bar bg-gray-300 h-2" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCardPlaceholder;
