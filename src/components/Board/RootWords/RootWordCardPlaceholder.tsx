import React from 'react';

type Props = {};

const RootWordCardPlaceholder = (props: Props) => {
  return (
    <div className="bg-gray-100 rounded-md shadow-sm animate-pulse">
      <div className="flex flex-col relative justify-center space-y-10 flex-1 p-6">
        <div className="flex items-center justify-between">
          <div className="loading-placeholder bg-gray-200 w-1/2 ">
            <div className="bar bg-gray-300 h-2"></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="loading-placeholder bg-gray-200 w-1/4 ">
            <div className="bar bg-gray-300 h-3"></div>
          </div>
          <div className="loading-placeholder bg-gray-200 w-3/4 ">
            <div className="bar bg-gray-300 h-6"></div>
          </div>
          <div className="loading-placeholder bg-gray-200 w-1/2 ">
            <div className="bar bg-gray-300 h-3"></div>
          </div>
        </div>

        <button
          type="button"
          className="modalBtn bg-slate-200 w-24 h-8"
        ></button>
      </div>
    </div>
  );
};

export default RootWordCardPlaceholder;
