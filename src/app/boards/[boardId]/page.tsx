'use client';
import WordsCard from '@/components/Board/WordCard';
import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { AiFillDelete } from 'react-icons/ai';
import { BiSolidEdit, BiTimeFive } from 'react-icons/bi';
import { MdUpdate } from 'react-icons/md';
import { Parallax } from 'react-parallax';
import SearchWord from '@/components/Board/SearchWord';
import { BoardAccess } from '@/interfaces/Board.d';
import WordCardPlaceholder from '@/components/Board/WordCardPlaceholder';

type Props = {
  params: {
    boardId: string;
  };
};

const Board = ({ params: { boardId } }: Props) => {
  const [userData] = useUserStore((state) => [state.userData]);

  const [userAccessLoading, setUserAccessLoading] = useState(false);
  const [userAccessFetchError, setUserAccessFetchError] = useState<Error | null>(null)

  const [boardLoading, setBoardLoading] = useState(false);
  const [boardFetchError, setBoardFetchError] = useState<Error | null>(null)

  const [wordsLoading, setWordsLoading] = useState(false);
  const [wordsFetchError, setWordsFetchError] = useState<Error | null>(null)

  const [rootWordsLoading, setRootWordsLoading] = useState(false);
  const [rootWordsFetchError, setRootWordsFetchError] = useState<Error | null>(null)

  const [
    userAccess,
    fetchUserAccess,
    board,
    fetchBoard,
    words,
    fetchWords,
    rootWords,
    fetchRootWords,
    openDeleteBoardModal,
    openEditBoardModal,
    openAddWordModal,
    openAddRootWordModal,
    reset,
  ] = useBoardStore((state) => [
    state.userAccess,
    state.fetchUserAccess,
    state.board,
    state.fetchBoard,
    state.words,
    state.fetchWords,
    state.rootWords,
    state.fetchRootWords,
    state.openDeleteBoardModal,
    state.openEditBoardModal,
    state.openAddWordModal,
    state.openAddRootWordModal,
    state.reset
  ]);

  useEffect(() => {
    const fetchUserAccessFunction = async () => {
      setUserAccessLoading(true)
      try {
        await fetchUserAccess(boardId, userData?.uid!);
      } catch (error: any) {
        setUserAccessFetchError(error)
      } finally {
        setUserAccessLoading(false)
      }
    }

    const fetchWordsFunction = async () => {
      setWordsLoading(true)
      try {
        await fetchWords(boardId, userData?.uid!);
      } catch (error: any) {
        setWordsFetchError(error)
      } finally {
        setWordsLoading(false)
      }
    }

    const fetchRootWordsFunction = async () => {
      setRootWordsLoading(true)
      try {
        await fetchRootWords(boardId, userData?.uid!);
      } catch (error: any) {
        setRootWordsFetchError(error)
      } finally {
        setRootWordsLoading(false)
      }
    }

    const fetchBoardFunction = async () => {
      setBoardLoading(true)
      try {
        fetchBoard(boardId, userData?.uid!);
      } catch (error: any) {
        setBoardFetchError(error)
      } finally {
        setBoardLoading(false)
      }
    }

    if (userData) {
      if (userAccess) {
        if (!board) fetchBoardFunction()
        if (board && !words) fetchWordsFunction()
        if (board && !rootWords) fetchRootWordsFunction()
      } else {
        fetchUserAccessFunction()
      }
    }
  }, [userData, boardId, fetchUserAccess, fetchBoard, fetchWords, fetchRootWords, userAccess, board, words, rootWords])

  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  // if (userAccessLoading || boardLoading) return <div>Loading...</div>
  if (userAccessFetchError) return <div> You dont have access to this board. </div>
  if (boardFetchError) return <div> Error fetching board. </div>

  return (
    <div className="space-y-8">
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

      <div className="space-y-4">
        <div className="">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-2xl text-gray-900 font-bold flex-1 text-left">
              {board?.metadata?.name}
            </h1>
            {userAccess === BoardAccess.OWNER ? (
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

      <hr />


      <div className="flex flex-col w-full sm:flex-row items-center gap-4">
        <SearchWord />
        {
          userAccess === BoardAccess.READ_ONLY ? null
            :
            <div className="flex items-center space-x-2">
              <button onClick={openAddRootWordModal} className="btn">
                Add Root Word
              </button>

              <button onClick={openAddWordModal} className="btn">
                Add Word
              </button>
            </div>
        }
      </div>

      <div className="flex flex-col space-y-6">
        {words && words.length > 0 ? words.map((word, idx) => (
          <WordsCard key={idx} idx={idx} word={word} />
        ))
          : wordsLoading || boardLoading ? Array.apply(null, Array(5)).map((_, idx) => <WordCardPlaceholder idx={idx} />) : <div className="">No word found.</div>
        }
      </div>
    </div>
  );
};

export default Board;
