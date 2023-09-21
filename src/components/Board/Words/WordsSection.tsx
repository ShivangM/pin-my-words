'use client';
import React, { useEffect, useState } from 'react';
import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';
import WordsPlaceholder from './WordsPlaceholder';
import InfiniteScroll from 'react-infinite-scroll-component';
import WordsCard from './WordCard';

const WordsSection = () => {
  const [words, filteredWords, fetchWords, board, selectedDate] = useBoardStore(
    (state) => [
      state.words,
      state.filteredWords,
      state.fetchWords,
      state.board,
      state.selectedDate,
    ]
  );

  const [userData] = useUserStore((state) => [state.userData]);

  useEffect(() => {
    if (board && userData && words.data.length === 0 && words.hasMore) {
      fetchWords(board._id, userData.uid);
    }

    if (
      board &&
      userData &&
      selectedDate &&
      filteredWords.data.length === 0 &&
      filteredWords.hasMore === true
    ) {
      fetchWords(board._id, userData.uid);
    }
  }, [board, userData, fetchWords, words, selectedDate, filteredWords]);

  const handleNext = async () => {
    if (board && userData) {
      return await fetchWords(board._id, userData.uid);
    }
  };

  return (
    <>
      {selectedDate ? (
        <InfiniteScroll
          dataLength={filteredWords.data.length}
          next={handleNext}
          hasMore={filteredWords.hasMore}
          loader={<WordsPlaceholder />}
          className="flex flex-col space-y-6"
        >
          {filteredWords.data.map((word, idx) => (
            <WordsCard key={idx} idx={idx} word={word} />
          ))}
        </InfiniteScroll>
      ) : (
        <InfiniteScroll
          dataLength={words.data.length}
          next={handleNext}
          hasMore={words.hasMore}
          loader={<WordsPlaceholder />}
          className="flex flex-col space-y-6"
        >
          {words.data.map((word, idx) => (
            <WordsCard key={idx} idx={idx} word={word} />
          ))}
        </InfiniteScroll>
      )}
    </>
  );
};

export default WordsSection;
