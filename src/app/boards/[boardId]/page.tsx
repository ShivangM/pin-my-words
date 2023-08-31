'use client';
import WordsCard from '@/components/Board/WordCard';
import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';
import { useEffect } from 'react';
import moment from 'moment';

type Props = {
  params: {
    boardId: string;
  };
};

const Board = ({ params: { boardId } }: Props) => {
  const [userData] = useUserStore((state) => [state.userData]);
  const [board, fetchBoard] = useBoardStore((state) => [
    state.board,
    state.fetchBoard,
  ]);

  useEffect(() => {
    fetchBoard(boardId, userData?.email!);
  }, [userData, boardId, fetchBoard]);

  return (
    <div className="">
      <div className="">
        <h1 className="text-2xl text-gray-900 font-bold text-left">
          {board?.metadata?.name}
        </h1>
        <p className="text-gray-500 text-sm">{board?.metadata?.description}</p>
        <time className="text-gray-500 text-sm">
          Created on {moment(board?.createdAt?.toDate()).format('MMMM Do YYYY')}
        </time>
        {/* <time className="text-gray-500 text-sm">
          Last updated on{' '}
          {moment(board?.updatedAt.toDate()).format('MMMM Do YYYY')}
        </time> */}
      </div>

      <hr className="my-8" />

      <div className="flex flex-col space-y-6">
        {new Array(10).fill(0).map((_, idx) => (
          <WordsCard
            key={idx}
            idx={idx}
            word={{
              word: 'Word',
              definition: 'Definition',
              image: '/assets/board-placeholder.svg',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
