'use client';
import CreateNewBoard from '@/components/Boards/CreateNewBoard';
import { Board } from '@/interfaces/Board';
import useBoardsStore from '@/store/boardsStore';
import useUserStore from '@/store/userStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const BoardCard = ({ board }: { board: Board }) => {
  const { _id, createdAt, metadata, owner, users } = board;

  return (
    <Link
      href={`/boards/${_id}`}
      className="group p-6 cursor-pointer rounded-md shadow-md"
    >
      <Image
        src={metadata.image || '/assets/board-placeholder.svg'}
        alt={metadata.name}
        width={500}
        height={288}
        className="object-cover object-center w-full rounded-md"
      />
      <div className="mt-6 mb-2">
        <span className="block text-xs font-medium uppercase text-green-400">
          {owner?.name}
        </span>
        <h2 className="text-xl font-semibold group-hover:underline">
          {metadata.name}
        </h2>
      </div>
      <p className="">{metadata.description}</p>
    </Link>
  );
};

const Boards = () => {
  const [userData] = useUserStore((state) => [state.userData]);
  const [boards, fetchBoards] = useBoardsStore((state) => [
    state.boards,
    state.fetchBoards,
  ]);

  console.log(boards);

  const router = useRouter();

  useEffect(() => {
    if (userData) fetchBoards(userData.email);
    else {
      toast.error('Please login to continue');
      router.push('/login');
    }
  }, []);

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 xl:p-10">
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <CreateNewBoard />
        {boards?.map((board) => (
          <BoardCard key={board._id} board={board} />
        ))}
      </div>
    </main>
  );
};

export default Boards;
