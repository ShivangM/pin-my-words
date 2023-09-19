'use client';
import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { AiFillDelete } from 'react-icons/ai';
import { BiTimeFive } from 'react-icons/bi';
import { IoMdSettings } from 'react-icons/io';
import { MdUpdate } from 'react-icons/md';
import SearchWord from '@/components/Board/SearchWord';
import { BoardAccess, BoardModes } from '@/interfaces/Board.d';
import useUIStore from '@/store/uiStore';
import WordsSection from '@/components/Board/Words/WordsSection';
import HeaderParallax from '@/components/Board/HeaderParallax';
import RootWordsSection from '@/components/Board/RootWords/RootWordsSection';
import SectionHeading from '@/components/Board/SectionHeading';

type Props = {
  params: {
    boardId: string;
  };
};

const Board = ({ params: { boardId } }: Props) => {
  const [userData] = useUserStore((state) => [state.userData]);

  const [userAccessLoading, setUserAccessLoading] = useState(false);
  const [userAccessFetchError, setUserAccessFetchError] =
    useState<Error | null>(null);
  const [boardFetchError, setBoardFetchError] = useState<Error | null>(null);

  const [
    userAccess,
    fetchUserAccess,
    board,
    boardMode,
    fetchBoard,
    rootWords,
    fetchRootWords,
    reset,
  ] = useBoardStore((state) => [
    state.userAccess,
    state.fetchUserAccess,
    state.board,
    state.boardMode,
    state.fetchBoard,
    state.rootWords,
    state.fetchRootWords,
    state.reset,
  ]);

  const [
    toggleAddWordModal,
    toggleAddRootWordModal,
    toggleDeleteBoardModal,
    toggleEditBoardModal,
  ] = useUIStore((state) => [
    state.toggleAddWordModal,
    state.toggleAddRootWordModal,
    state.toggleDeleteBoardModal,
    state.toggleEditBoardModal,
  ]);

  useEffect(() => {
    const fetchUserAccessFunction = async () => {
      setUserAccessLoading(true);
      try {
        await fetchUserAccess(boardId, userData?.uid!);
      } catch (error: any) {
        setUserAccessFetchError(error);
      } finally {
        setUserAccessLoading(false);
      }
    };

    const fetchBoardFunction = async () => {
      try {
        fetchBoard(boardId, userData?.uid!);
      } catch (error: any) {
        setBoardFetchError(error);
      }
    };

    if (userData) {
      if (userAccess) {
        if (!board) fetchBoardFunction();
      } else {
        fetchUserAccessFunction();
      }
    }
  }, [
    userData,
    boardId,
    fetchUserAccess,
    fetchBoard,
    fetchRootWords,
    userAccess,
    board,
    rootWords,
  ]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // if (userAccessLoading || boardLoading) return <div>Loading...</div>
  if (userAccessFetchError)
    return <div> You dont have access to this board. </div>;
  if (boardFetchError) return <div> Error fetching board. </div>;
  if (!board) return <div>Loading...</div>;

  return (
    <div className="space-y-8 pb-6">
      <HeaderParallax image={board.image} name={board.name} />

      <div className="space-y-4">
        <div className="">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-2xl text-gray-900 font-bold flex-1 text-left">
              {board.name}
            </h1>
            {userAccess === BoardAccess.OWNER ? (
              <div className="w-fit flex items-center space-x-2">
                <IoMdSettings
                  onClick={toggleEditBoardModal}
                  className="w-6 h-6 cursor-pointer text-gray-700"
                />
                <AiFillDelete
                  onClick={toggleDeleteBoardModal}
                  className="w-6 h-6 cursor-pointer text-red-500"
                />
              </div>
            ) : null}
          </div>
          <p className="text-gray-500 text-sm">{board.description}</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <BiTimeFive className="text-xl" />
            <time className="text-gray-500 flex flex-col text-sm">
              <span className="font-semibold text-gray-900">Created At: </span>
              <span>
                {moment(board.createdAt.toDate()).format('MMMM Do YYYY')}
              </span>
            </time>
          </div>

          <div className="flex items-center space-x-1">
            <MdUpdate className="text-xl" />
            <time className="text-gray-500 flex flex-col text-sm">
              <span className="font-semibold text-gray-900">Updated At: </span>
              <span>
                {moment(board.updatedAt.toDate()).format('MMMM Do YYYY')}
              </span>
            </time>
          </div>
        </div>
      </div>

      <hr />

      <div className="flex flex-col w-full sm:flex-row items-center gap-4">
        <SearchWord />
        {userAccess === BoardAccess.READ_ONLY ? null : (
          <div className="flex items-center space-x-2">
            <button onClick={toggleAddRootWordModal} className="btn">
              Add Root Word
            </button>

            <button onClick={toggleAddWordModal} className="btn">
              Add Word
            </button>
          </div>
        )}
      </div>

      <SectionHeading />

      {boardMode === BoardModes.WORDS ? <WordsSection /> : <RootWordsSection />}
    </div>
  );
};

export default Board;
