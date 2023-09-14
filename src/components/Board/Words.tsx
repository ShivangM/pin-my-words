import React, { useEffect } from 'react'
import WordsCard from './WordCard'
import useBoardStore from '@/store/boardStore'
import WordsCardPlaceholder from './WordCardPlaceholder'
import useUserStore from '@/store/userStore'
import moment from 'moment'

type Props = {}

const Words = (props: Props) => {
    const [words, wordsLoading, filteredWords, fetchWords, board, selectedDate] = useBoardStore((state) => [state.words, state.wordsLoading, state.filteredWords, state.fetchWords, state.board, state.selectedDate])

    const [userData] = useUserStore((state) => [state.userData])

    useEffect(() => {
        if (board && userData && !words) {
            fetchWords(board._id, userData.uid)
        }
    }, [board, userData, fetchWords, words])

    return (
        <div className="space-y-4">
            {
                filteredWords && filteredWords.length > 0 ?
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                            {moment(new Date(selectedDate?.year!, selectedDate?.month! - 1, selectedDate?.day!)).format('MMMM Do YYYY')}
                        </h2>
                        <span className="text-gray-500 text-sm">
                            {filteredWords.length} words
                        </span>
                    </div>
                    : null
            }

            <div className="flex flex-col space-y-6">
                {
                    wordsLoading ?
                        Array.apply(null, Array(5)).map((_, idx) => <WordsCardPlaceholder key={idx} idx={idx} />)
                        :
                        filteredWords && filteredWords.length > 0 ?
                            filteredWords.map((word, idx) => (
                                <WordsCard key={idx} idx={idx} word={word} />
                            ))
                            :
                            words && words.length > 0 ? words.map((word, idx) => (
                                <WordsCard key={idx} idx={idx} word={word} />
                            ))
                                :
                                <div className="">No word found.</div>
                }
            </div>
        </div>
    )
}

export default Words