'use client'
import React, { useEffect } from 'react'
import useBoardStore from '@/store/boardStore'
import useUserStore from '@/store/userStore'
import moment from 'moment'
import convertDayValueToDate from '@/utils/convertDayValueToDate'
import Words from './Words'
import WordsPlaceholder from './WordsPlaceholder'

const WordsSection = () => {
    const [words, filteredWords, wordsLoading, fetchWords, board, selectedDate] = useBoardStore((state) => [state.words, state.filteredWords, state.wordsLoading, state.fetchWords, state.board, state.selectedDate])

    const [userData] = useUserStore((state) => [state.userData])

    useEffect(() => {
        if (board && userData && !words) {
            fetchWords(board._id, userData.uid)
        }
    }, [board, userData, fetchWords, words])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                    {selectedDate ? moment(convertDayValueToDate(selectedDate)).format('MMMM Do YYYY') : "All Words"}
                </h2>
                {
                    wordsLoading ? null :
                        <span className="text-gray-500 text-sm">
                            {filteredWords ? filteredWords.length : words?.length} words
                        </span>
                }
            </div>

            {wordsLoading ? <WordsPlaceholder /> : <Words words={filteredWords || words} />}
        </div>
    )
}

export default WordsSection