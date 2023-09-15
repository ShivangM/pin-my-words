import React from 'react'

type Props = {}

const NotificationCardPlaceholder = (props: Props) => {
    return (
        <div className="grid grid-cols-8 animate-pulse items-center w-full max-w-xs p-4 gap-4 loading-placeholder bg-white divide-x divide-gray-200 rounded-lg shadow" role="alert">
            <div className="col-span-1">
                <div className="h-5 aspect-square image-loading-animation"></div>
            </div>
            <div className="pl-4 col-span-7 text-sm font-normal">
                <div className='w-3/4 bg-gray-200' >
                    <div className="bar h-2 bg-gray-300"></div>
                </div>
                <div className="w-full  space-y-1">
                    <div className="w-full bg-gray-200">
                        <div className="bar h-3 bg-gray-300"></div>
                    </div>
                    <div className="w-1/2 bg-gray-200">
                        <div className="bar h-3 bg-gray-300"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotificationCardPlaceholder