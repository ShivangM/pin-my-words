import useBoardStore from '@/store/boardStore'
import useUserStore from '@/store/userStore'
import { useEffect } from 'react'
import RootWordsPlaceholder from './RootWordsPlaceholder'
import RootWords from './RootWords'

const RootWordsSection = () => {
    const [rootWords, rootWordsLoading, fetchRootWords, board] = useBoardStore((state) => [state.rootWords, state.rootWordsLoading, state.fetchRootWords, state.board])

    const [userData] = useUserStore((state) => [state.userData])

    useEffect(() => {
        if (board && userData && !rootWords) {
            fetchRootWords(board._id, userData.uid)
        }
    }, [board, userData, fetchRootWords, rootWords])

    return (
        <div className='space-y-4' >
            {rootWordsLoading ? <RootWordsPlaceholder /> : <RootWords rootWords={rootWords} />}
        </div>
    )
}

export default RootWordsSection