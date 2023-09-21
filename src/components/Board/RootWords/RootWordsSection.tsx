import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';
import { useEffect } from 'react';
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
    if (board && userData && rootWords.data.length === 0 && rootWords.hasMore) {
      fetchRootWords(board._id, userData.uid);
    }
  }, [board, userData, fetchRootWords, rootWords]);

  const handleNext = async () => {
    if (board && userData) {
      return await fetchRootWords(board._id, userData.uid);
    }
  };

  return (
    <InfiniteScroll
      dataLength={rootWords.data.length}
      next={handleNext}
      hasMore={rootWords.hasMore}
      loader={<RootWordsPlaceholder />}
      className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6"
    >
      {rootWords.data.map((rootWord, idx) => (
        <RootWordCard key={idx} rootWord={rootWord} />
      ))}
    </InfiniteScroll>
  );
};

export default RootWordsSection;
