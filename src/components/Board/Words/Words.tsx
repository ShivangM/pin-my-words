import React from 'react'
import WordsCard from './WordCard'
import { Word } from '@/interfaces/Word'

const Words = ({ words }: { words: Word[] | null }) => {
    return (
        <div className="flex flex-col space-y-6">
            {words && words.length > 0 ?
                words.map((word, idx) => (
                    <WordsCard key={idx} idx={idx} word={word} />
                ))
                :
                <div>
                    <p className="text-gray-500 text-sm">
                        No words found.
                    </p>
                </div>}
        </div>
    )
}

export default Words