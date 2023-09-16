import CreateBoardModal from '@/components/Boards/CreateBoardModal';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Boards",
}

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CreateBoardModal />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 xl:p-10">
        <div className="flex flex-1 min-h-screen flex-col">{children}</div>
      </main>
    </>
  );
}
