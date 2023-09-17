import { BoardAccess } from '@/interfaces/Board.d'
import { RootWord } from '@/interfaces/Word.d'
import useBoardStore from '@/store/boardStore'
import useUIStore from '@/store/uiStore'
import moment from 'moment'
import React from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { BiSolidEdit } from 'react-icons/bi'

type Props = {
    rootWord: RootWord
}

const RootWordCard = ({ rootWord }: Props) => {
    const { updatedAt, meaning, root, type } = rootWord

    const [userAccess] = useBoardStore(state => [state.userAccess])
    const [toggleViewRootWordModal, toggleEditRootWordModal, toggleDeleteRootWordModal] = useUIStore(state => [state.toggleViewRootWordModal, state.toggleEditRootWordModal, state.toggleDeleteRootWordModal])

    return (
        <div className='bg-gray-100 rounded-md shadow-sm'>
            <div className="flex flex-col relative justify-center space-y-6 flex-1 p-6">
                <div className="flex items-center justify-between">
                    <p className='text-xs text-gray-400' ><span className='font-medium text-gray-500' >Last Updated:</span> {moment(updatedAt.toDate()).fromNow()}</p>
                    {
                        userAccess === BoardAccess.READ_ONLY ? null
                            :
                            <div className="w-fit flex items-center space-x-2">
                                <BiSolidEdit
                                    onClick={() => toggleEditRootWordModal(rootWord)}
                                    className="w-6 h-6 cursor-pointer text-gray-700"
                                />
                                <AiFillDelete
                                    onClick={() => toggleDeleteRootWordModal(rootWord)}
                                    className="w-6 h-6 cursor-pointer text-red-500"
                                />
                            </div>
                    }
                </div>

                <div className="">
                    <span className="text-xs uppercase">{type}</span>
                    <h3 className="text-3xl font-bold space-x-2">
                        <span>{root}</span>
                    </h3>
                    <p className="">{meaning}</p>
                </div>

                <button
                    type="button"
                    onClick={() => toggleViewRootWordModal(rootWord)}
                    className="modalBtn bg-slate-200 hover:bg-slate-300 w-fit"
                >
                    View More
                </button>
            </div>
        </div>
    )
}

export default RootWordCard