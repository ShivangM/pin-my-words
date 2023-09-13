'use client';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import useUIStore from '@/store/uiStore';

type Props = {};

const OpenSidePanelButton = (props: Props) => {
  const toggleSidePanel = useUIStore((state) => state.toggleSidePanel);

  return (
    <button
      onClick={toggleSidePanel}
      className="fixed lg:hidden right-0 top-1/2 z-30"
    >
      <BsFillArrowLeftSquareFill className="h-8 w-8 text-brand" />
    </button>
  );
};

export default OpenSidePanelButton;
