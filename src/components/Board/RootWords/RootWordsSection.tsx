import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';
import { useEffect, useState } from 'react';
import RootWordsPlaceholder from './RootWordsPlaceholder';
import InfiniteScroll from 'react-infinite-scroll-component';
import RootWordCard from './RootWordCard';

const RootWordsSection = () => {
  const [rootWords, fetchRootWords, board] = useBoardStore((state) => [
    state.rootWords,
    state.fetchRootWords,
    state.board,
  ]);

  const [userData] = useUserStore((state) => [state.userData]);

  useEffect(() => {
    if (
      board &&
      userData &&
      rootWords.length === 0 &&
      board.totalRootWords > 0
    ) {
      fetchRootWords(board._id, userData.uid, 6);
    }
  }, [board, userData, fetchRootWords, rootWords]);

  const handleNext = async () => {
    const lastRootWordId = rootWords[rootWords.length - 1]._id;

    if (board && userData) {
      return await fetchRootWords(board._id, userData.uid, 6, lastRootWordId);
    }
  };

  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    if (board && rootWords) {
      setHasMore(rootWords.length < board.totalRootWords);
    }
  }, [board, rootWords]);

  return (
    <InfiniteScroll
      dataLength={rootWords.length}
      next={handleNext}
      hasMore={hasMore}
      loader={<RootWordsPlaceholder />}
      className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6"
    >
      {rootWords.map((rootWord, idx) => (
        <RootWordCard key={idx} rootWord={rootWord} />
      ))}
    </InfiniteScroll>
  );
};

export default RootWordsSection;
