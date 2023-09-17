import AddRootWordModal from '@/components/Board/RootWords/AddRootWordModal';
import AddWordModal from '@/components/Board/Words/AddWordModal';
import DeleteBoardModal from '@/components/Board/DeleteBoardModal';
import DeleteWordModal from '@/components/Board/Words/DeleteWordModal';
import EditBoardModal from '@/components/Board/EditBoardModal';
import EditWordModal from '@/components/Board/Words/EditWordModal';
import OpenSidePanelButton from '@/components/Board/OpenSidePanelButton';
import SidePanel from '@/components/Board/SidePanel/SidePanel';
import ViewRootWordModal from '@/components/Board/RootWords/ViewRootWordModal';
import AddUserModal from '@/components/Board/SidePanel/Users/AddUserModal';
import LeaveBoardModal from '@/components/Board/SidePanel/Users/LeaveBoardModal';
import RemoveUserModal from '@/components/Board/SidePanel/Users/RemoveUserModal';
import UpdateUserAccessModal from '@/components/Board/SidePanel/Users/UpdateUserAccessModal';
import React from 'react';
import SidePanelBackdrop from '@/components/Board/SidePanel/SidePanelBackdrop';
import ViewWordModal from '@/components/Board/Words/ViewWordModal';
import DeleteRootWordModal from '@/components/Board/RootWords/DeleteRootWordModal';
import EditRootWordModal from '@/components/Board/RootWords/EditRootWordModal';

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidePanelBackdrop />
      <OpenSidePanelButton />

      {/* Users  */}
      <LeaveBoardModal />
      <AddUserModal />
      <RemoveUserModal />
      <UpdateUserAccessModal />

      {/* Root Word Options  */}
      <AddRootWordModal />
      <DeleteRootWordModal />
      <EditRootWordModal />
      <ViewRootWordModal />

      {/* Word Options  */}
      <AddWordModal />
      <DeleteWordModal />
      <EditWordModal />
      <ViewWordModal />

      {/* Board Options  */}
      <DeleteBoardModal />
      <EditBoardModal />

      <main className="container relative flex lg:space-x-10 mx-auto">
        <div className="flex flex-1 min-h-screen flex-col">{children}</div>
        <SidePanel />
      </main>
    </>
  );
}
