'use client';
import WordsCard from '@/components/Board/WordCard';
import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';
import { useEffect } from 'react';
import moment from 'moment';
import { AiFillDelete } from 'react-icons/ai';
import { BiSolidEdit } from 'react-icons/bi';

type Props = {
  params: {
    boardId: string;
  };
};

const Board = ({ params: { boardId } }: Props) => {
  const [userData] = useUserStore((state) => [state.userData]);
  const [board, fetchBoard, words] = useBoardStore((state) => [
    state.board,
    state.fetchBoard,
    state.words,
  ]);

  useEffect(() => {
    fetchBoard(boardId, userData?.email!);
  }, [userData, boardId, fetchBoard]);

  return (
    <div className="">
      <div className="">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl text-gray-900 font-bold flex-1 text-left">
            {board?.metadata?.name}
          </h1>
          <div className="w-fit flex items-center space-x-2">
            <BiSolidEdit className="w-6 h-6 cursor-pointer text-gray-700" />
            <AiFillDelete className="w-6 h-6 cursor-pointer text-red-500" />
          </div>
        </div>
        <p className="text-gray-500 text-sm">{board?.metadata?.description}</p>
        <time className="text-gray-500 text-sm">
          Created on {moment(board?.createdAt?.toDate()).format('MMMM Do YYYY')}
        </time>
        {board?.updatedAt && (
          <time className="text-gray-500 text-sm">
            Last updated on{' '}
            {moment(board?.updatedAt.toDate()).format('MMMM Do YYYY')}
          </time>
        )}
      </div>

      <hr className="my-8" />

      <div className="flex flex-col space-y-6">
        {words?.map((word, idx) => (
          <WordsCard key={idx} idx={idx} word={word} />
        ))}
      </div>
    </div>
  );
};

export default Board;
