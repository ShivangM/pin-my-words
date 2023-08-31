'use client';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import useBoardStore from '@/store/boardStore';

type Props = {};

const OpenSidePanelButton = (props: Props) => {
  const [openSidePanel] = useBoardStore((state) => [state.openSidePanel]);

  return (
    <button
      onClick={openSidePanel}
      className="fixed lg:hidden right-0 top-1/2 z-30"
    >
      <BsFillArrowLeftSquareFill className="h-8 w-8 text-brand" />
    </button>
  );
};

export default OpenSidePanelButton;
