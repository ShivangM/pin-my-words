'use client';
import { Board } from '@/interfaces/Board';
import fetchBoards from '@/lib/fetchBoards';
import useUserStore from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';

const BoardCard = ({ board }: { board: Board }) => {
  const { name, type, users, description, image, owner, _id } = board;

  return (
    <Link
      href={`/boards/${_id}`}
      className="group p-6 cursor-pointer rounded-md shadow-md"
    >
      <Image
        src={image || '/assets/board-placeholder.svg'}
        alt={name}
        width={500}
        height={288}
        className="object-cover object-center w-full rounded-md"
      />
      <div className="mt-6 mb-2">
        <span className="block text-xs font-medium uppercase text-green-400">
          {owner?.name}
        </span>
        <h2 className="text-xl font-semibold group-hover:underline">{name}</h2>
      </div>
      <p className="">{description}</p>
    </Link>
  );
};

const Boards = () => {
  const [userData] = useUserStore((state) => [state.userData]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['boards'],
    queryFn: () => fetchBoards(userData?.uid!),
    enabled: !!userData,
  });

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 xl:p-10">
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error</div>
      ) : (
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Boards;
