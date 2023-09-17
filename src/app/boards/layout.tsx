import CreateBoardModal from '@/components/Boards/CreateBoardModal';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boards',
};

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CreateBoardModal />
      <main className="container mx-auto">
        <div className="flex flex-1 min-h-screen flex-col">{children}</div>
      </main>
    </>
  );
}
