'use client';
import React, { useEffect, useState } from 'react';
import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';
import WordsPlaceholder from './WordsPlaceholder';
import InfiniteScroll from 'react-infinite-scroll-component';
import WordsCard from './WordCard';

const WordsSection = () => {
  const [words, filteredWords, fetchWords, board, selectedDate, filterByDate] =
    useBoardStore((state) => [
      state.words,
      state.filteredWords,
      state.fetchWords,
      state.board,
      state.selectedDate,
      state.filterByDate,
    ]);

  const [userData] = useUserStore((state) => [state.userData]);

  useEffect(() => {
    if (board && userData && words.length === 0 && board.totalWords > 0) {
      fetchWords(board._id, userData.uid, 10);
    }
  }, [board, userData, fetchWords, words]);

  const handleNext = async () => {
    const lastWordId =
      filteredWords.length > 0
        ? filteredWords[filteredWords.length - 1]._id
        : words[words.length - 1]._id;

    if (board && userData) {
      if (selectedDate) {
        return await filterByDate(selectedDate, userData.uid, 10, lastWordId);
      } else {
        return await fetchWords(board._id, userData.uid, 10, lastWordId);
      }
    }
  };

  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    if (board && words) {
      setHasMore(words.length < board.totalWords);
    }
  }, [board, words]);

  return (
    <InfiniteScroll
      dataLength={words.length}
      next={handleNext}
      hasMore={hasMore}
      loader={<WordsPlaceholder />}
      className="flex flex-col space-y-6"
    >
      {words.map((word, idx) => (
        <WordsCard key={idx} idx={idx} word={word} />
      ))}
    </InfiniteScroll>
  );
};

export default WordsSection;
