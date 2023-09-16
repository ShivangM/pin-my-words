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

                {/* <div className="space-y-1 w-full">
                    <h4 className="text-sm font-bold">Root Word(s): </h4>
                    <ul className="space-x-2 overflow-x-auto text-sm text-gray-900 font-medium cursor-pointer list-inside list-none flex items-center">
                        {word.roots && word.roots.length > 0 ? word.roots.map((root) => (
                            <li key={root.value} onClick={() => handleViewRootWord(root.value)} className="px-2 py-0.5 transition-all ease-in-out duration-300 bg-gray-200 hover:bg-gray-300 rounded-lg">
                                {root.label}
                            </li>
                        ))
                            : <div className="text-gray-500">No Root Word(s) Provided.</div>
                        }
                    </ul>
                </div> */}

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