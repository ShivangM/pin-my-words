'use client';
import useBoardStore from '@/store/boardStore';
import classNames from 'classnames';
import { AiFillCloseCircle } from 'react-icons/ai';

type Props = {};

const SidePanel = (props: Props) => {
  const [sidePanelOpen, closeSidePanel] = useBoardStore((state) => [
    state.sidePanelOpen,
    state.closeSidePanel,
  ]);

  return (
    <div
      className={classNames(
        'w-3/4 h-screen transition-all duration-300 ease-in-out lg:w-1/4 lg:h-96 bg-gray-100 fixed z-50 lg:z-30 lg:sticky right-0 top-0 lg:translate-x-0 lg:transform p-4',
        sidePanelOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      {/* Side Panel  */}
      <div className="w-full flex items-center justify-end">
        <button onClick={closeSidePanel} className="text-red-500 lg:hidden">
          <AiFillCloseCircle className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
};

export default SidePanel;
