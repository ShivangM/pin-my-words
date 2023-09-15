import React from 'react'
import WordsCardPlaceholder from './WordCardPlaceholder'

const WordsPlaceholder = () => {
    return (
        Array.apply(null, Array(5)).map((_, idx) => <WordsCardPlaceholder key={idx} idx={idx} />)
    )
}

export default WordsPlaceholder