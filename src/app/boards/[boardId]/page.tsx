'use client';
import WordsCard from '@/components/Board/WordCard';
import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';
import { useEffect } from 'react';
import moment from 'moment';
import { AiFillDelete } from 'react-icons/ai';
import { BiSolidEdit, BiTimeFive } from 'react-icons/bi';
import { MdUpdate } from 'react-icons/md';
import { Parallax } from 'react-parallax';

type Props = {
  params: {
    boardId: string;
  };
};

const Board = ({ params: { boardId } }: Props) => {
  const [userData] = useUserStore((state) => [state.userData]);

  const [
    board,
    fetchBoard,
    words,
    openDeleteBoardModal,
    openEditBoardModal,
    loading,
  ] = useBoardStore((state) => [
    state.board,
    state.fetchBoard,
    state.words,
    state.openDeleteBoardModal,
    state.openEditBoardModal,
    state.loading,
  ]);

  useEffect(() => {
    fetchBoard(boardId, userData?.email!);
  }, [boardId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <Parallax
        blur={{ min: -15, max: 15 }}
        bgImage={board?.metadata?.image || '/assets/board-placeholder.svg'}
        bgImageAlt={board?.metadata?.name}
        bgStyle={{ objectFit: 'cover' }}
        bgImageStyle={{ objectFit: 'cover' }}
        strength={-300}
      >
        <div style={{ height: '300px' }} />
      </Parallax>

      <div className="mt-8 space-y-4">
        <div className="">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-2xl text-gray-900 font-bold flex-1 text-left">
              {board?.metadata?.name}
            </h1>
            {board?.owner === userData?.uid ? (
              <div className="w-fit flex items-center space-x-2">
                <BiSolidEdit
                  onClick={openEditBoardModal}
                  className="w-6 h-6 cursor-pointer text-gray-700"
                />
                <AiFillDelete
                  onClick={openDeleteBoardModal}
                  className="w-6 h-6 cursor-pointer text-red-500"
                />
              </div>
            ) : null}
          </div>
          <p className="text-gray-500 text-sm">
            {board?.metadata?.description}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <BiTimeFive className="text-xl" />
            <time className="text-gray-500 flex flex-col text-sm">
              <span className="font-semibold text-gray-900">Created At: </span>
              <span>
                {moment(board?.createdAt?.toDate()).format('MMMM Do YYYY')}
              </span>
            </time>
          </div>

          <div className="flex items-center space-x-1">
            <MdUpdate className="text-xl" />
            <time className="text-gray-500 flex flex-col text-sm">
              <span className="font-semibold text-gray-900">Updated At: </span>
              <span>
                {moment(board?.updatedAt.toDate()).format('MMMM Do YYYY')}
              </span>
            </time>
          </div>
        </div>
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
