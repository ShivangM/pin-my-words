'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Board } from '@/interfaces/Board';
import useUserStore from '@/store/userStore';

const BoardCard = ({ board }: { board: Board }) => {
  const { _id, createdAt, metadata, owner } = board;
  const userData = useUserStore((state) => state.userData);

  return (
    <Link
      href={`/boards/${_id}`}
      className="group p-6 cursor-pointer rounded-md shadow-md"
    >
      <Image
        src={metadata?.image || '/assets/board-placeholder.svg'}
        alt={metadata?.name}
        width={500}
        height={288}
        className="object-cover object-center w-full rounded-md"
      />
      <div className="mt-6 mb-2">
        <span className="block text-xs font-medium uppercase text-green-400">
          {owner === userData?.uid ? 'Owned' : 'Shared with you'}
        </span>
        <h2 className="text-xl font-semibold group-hover:underline">
          {metadata?.name}
        </h2>
      </div>
      <p className="">{metadata?.description}</p>
    </Link>
  );
};

export default BoardCard;
