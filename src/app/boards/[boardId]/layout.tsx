import DeleteBoardModal from '@/components/Board/DeleteBoardModal';
import EditBoardModal from '@/components/Board/EditBoardModal';
import OpenSidePanelButton from '@/components/Board/OpenSidePanelButton';
import SidePanel from '@/components/Board/SidePanel';
import SidePanelBackdrop from '@/components/Board/SidePanelBackdrop';
import React from 'react';

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidePanelBackdrop />
      <OpenSidePanelButton />
      <DeleteBoardModal />
      <EditBoardModal />
      <main className="container relative flex space-x-10 mx-auto p-4 sm:p-6 lg:p-8 xl:p-10">
        <div className="flex flex-1 min-h-screen flex-col">{children}</div>
        <SidePanel />
      </main>
    </>
  );
}
