import AddRootWordModal from '@/components/Board/AddRootWordModal';
import AddWordModal from '@/components/Board/AddWordModal';
import DeleteBoardModal from '@/components/Board/DeleteBoardModal';
import DeleteWordModal from '@/components/Board/DeleteWordModal';
import EditBoardModal from '@/components/Board/EditBoardModal';
import EditWordModal from '@/components/Board/EditWordModal';
import OpenSidePanelButton from '@/components/Board/OpenSidePanelButton';
import SidePanel from '@/components/Board/SidePanel';
import SidePanelBackdrop from '@/components/Board/SidePanelBackdrop';
import ViewWordModal from '@/components/Board/ViewWordModal';
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

      {/* Root Word Options  */}
      <AddRootWordModal />

      {/* Word Options  */}
      <AddWordModal />
      <DeleteWordModal />
      <EditWordModal />
      <ViewWordModal />

      {/* Board Options  */}
      <DeleteBoardModal />
      <EditBoardModal />

      <main className="container relative flex lg:space-x-10 mx-auto sm:p-6 lg:p-8 xl:p-10">
        <div className="flex flex-1 min-h-screen flex-col">{children}</div>
        <SidePanel />
      </main>
    </>
  );
}
