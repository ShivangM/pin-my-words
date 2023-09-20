'use client';
import BoardCard from '@/components/Boards/BoardCard';
import BoardsPlaceholder from '@/components/Boards/BoardsPlaceholder';
import useBoardStore from '@/store/boardStore';
import useUIStore from '@/store/uiStore';
import useUserStore from '@/store/userStore';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';

const Boards = () => {
  const [userData] = useUserStore((state) => [state.userData]);
  const [boards, fetchBoards] = useBoardStore((state) => [
    state.boards,
    state.fetchBoards,
  ]);

  const [toggleAddBoardModal] = useUIStore((state) => [
    state.toggleAddBoardModal,
  ]);

  useEffect(() => {
    if (userData && boards.length !== userData.totalBoards) {
      try {
        fetchBoards(userData.uid!, 10);
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  }, [userData, fetchBoards, boards]);

  const handleNext = async () => {
    const lastBoardId = boards[boards.length - 1]._id;

    if (userData) {
      await fetchBoards(userData?.uid!, 10, lastBoardId);
    }
  };

  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    if (userData) {
      setHasMore(boards.length < userData.totalBoards);
    }
  }, [boards, userData]);

  return (
    <InfiniteScroll
      dataLength={boards.length}
      next={handleNext}
      hasMore={hasMore}
      loader={<BoardsPlaceholder />}
      className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {/* Opens Create New Board Modal  */}
      <button
        onClick={toggleAddBoardModal}
        className="p-6 text-left cursor-pointer border-2 border-dashed border-spacing-4 hover:border-brand transition-all ease-in-out duration-200 rounded-md"
      >
        <div className="w-full relative rounded-md overflow-hidden aspect-square">
          <Image
            src="/assets/board-placeholder.svg"
            alt="Create a new board"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="mt-6 mb-2">
          <h2 className="text-xl font-semibold">Create a new board</h2>
        </div>
        <p className="">Add a new board.</p>
      </button>

      {/* Boards */}
      {boards.map((board) => (
        <BoardCard key={board._id} board={board} />
      ))}
    </InfiniteScroll>
  );
};

export default Boards;
