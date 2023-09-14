'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Board } from '@/interfaces/Board';
import useUserStore from '@/store/userStore';

const BoardCard = ({ board }: { board: Board }) => {
  const { _id, description, image, name, owner } = board;
  const userData = useUserStore((state) => state.userData);

  return (
    <Link
      href={`/boards/${_id}`}
      className="group p-6 cursor-pointer w-full rounded-md shadow-md"
    >
      <div className="w-full relative rounded-md overflow-hidden aspect-square">
        <Image
          src={image || '/assets/board-placeholder.svg'}
          alt={name}
          fill
          className="group-hover:scale-105 transition-all ease-in-out duration-500 object-cover object-center"
          objectFit="cover"
        />
      </div>

      <div className="mt-6 mb-2">
        <span className="block text-xs font-medium uppercase text-green-400">
          {owner === userData?.uid ? 'Owned' : 'Shared with you'}
        </span>
        <h2 className="text-xl font-semibold group-hover:underline">
          {name}
        </h2>
      </div>

      <p className="w-full text-sm text-gray-400 line-clamp-3 break-all whitespace-normal">{description}</p>
    </Link>
  );
};

export default BoardCard;
