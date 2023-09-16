import { RootWord } from '@/interfaces/Word'
import React from 'react'
import RootWordCard from './RootWordCard'

type Props = {
    rootWords: RootWord[] | null
}

const RootWords = ({ rootWords }: Props) => {
    return (
        <div className="grid grid-cols-3 gap-6">
            {rootWords && rootWords.length > 0 ?
                rootWords.map((rootWords, idx) => (
                    <RootWordCard key={idx} rootWord={rootWords} />
                ))
                :
                <div>
                    <p className="text-gray-500 text-sm">
                        No root words found.
                    </p>
                </div>}
        </div>
    )
}

export default RootWords