'use client';
import useUIStore from '@/store/uiStore';
import classNames from 'classnames';

type Props = {};

const SidePanelBackdrop = (props: Props) => {
  const [sidePanelOpen] = useUIStore((state) => [state.sidePanelOpen]);

  return (
    <div
      className={classNames(
        'h-screen w-full fixed top-0 left-0 bg-black opacity-60 z-[45] lg:hidden',
        sidePanelOpen ? 'block' : 'hidden'
      )}
    />
  );
};

export default SidePanelBackdrop;
