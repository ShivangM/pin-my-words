// LoadingPlaceholder.tsx
import React from 'react';

const BoardCardPlaceholder = () => {
    return (
        <div className="group p-6 cursor-pointer rounded-md shadow-md loading-placeholder">
            <div className="w-full relative rounded-md overflow-hidden aspect-square">
                {/* Image Loading Animation */}
                <div className="image-loading-animation"></div>
            </div>

            <div className="mt-6 mb-4">
                <div className="bg-gray-200 w-1/4">
                    <div className="bar bg-gray-300 h-3"></div>
                </div>
                <h2 className="bg-gray-200 w-3/4">
                    <div className="bar bg-gray-300 h-5"></div>
                </h2>
            </div>

            <div className="bg-gray-200 w-full space-y-2">
                <div className="bar bg-gray-300 h-4"></div>
            </div>
        </div>
    );
};

export default BoardCardPlaceholder;
