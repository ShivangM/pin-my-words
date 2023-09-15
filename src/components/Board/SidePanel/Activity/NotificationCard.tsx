import { Notification, NotificationType } from '@/interfaces/Notification.d'
import moment from 'moment'
import React from 'react'
import { BiSolidCommentEdit, BiSolidMessageSquareAdd, BiSolidMessageSquareEdit } from 'react-icons/bi'
import { BsPersonFillGear, BsPersonXFill } from 'react-icons/bs'
import { IoMdConstruct, IoMdNotifications, IoMdRemoveCircle } from 'react-icons/io'
import { MdAddBox, MdPersonAdd, MdPersonRemove } from 'react-icons/md'

type Props = {
    notification: Notification
}

const Icon = ({ type }: { type: NotificationType }) => {
    switch (type) {
        case NotificationType.WORD_ADDED:
            return <BiSolidMessageSquareAdd className='w-5 h-5 text-blue-600' />
        case NotificationType.WORD_DELETED:
            return <IoMdRemoveCircle className='w-5 h-5 text-red-600' />
        case NotificationType.WORD_UPDATED:
            return <BiSolidCommentEdit className='w-5 h-5 text-green-600' />

        case NotificationType.ROOT_WORD_ADDED:
            return <MdAddBox className='w-5 h-5 text-blue-600' />
        case NotificationType.ROOT_WORD_DELETED:
            return <IoMdRemoveCircle className='w-5 h-5 text-red-600' />
        case NotificationType.ROOT_WORD_UPDATED:
            return <BiSolidMessageSquareEdit className='w-5 h-5 text-green-600' />


        case NotificationType.USER_ADDED:
            return <MdPersonAdd className='w-5 h-5 text-blue-600' />
        case NotificationType.USER_REMOVED:
            return <MdPersonRemove className='w-5 h-5 text-red-600' />
        case NotificationType.USER_UPDATED:
            return <BsPersonFillGear className='w-5 h-5 text-green-600' />
        case NotificationType.USER_LEFT:
            return <BsPersonXFill className='w-5 h-5 text-red-600' />

        case NotificationType.BOARD_UPDATED:
            return <IoMdConstruct className='w-5 h-5 text-green-600' />

        default:
            return <IoMdNotifications className='w-5 h-5 text-blue-600' />
    }
}

const NotificationCard = ({ notification }: Props) => {
    return (
        <div className="grid grid-cols-8 items-center w-full max-w-xs p-4 gap-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow" role="alert">
            <div className="col-span-1">
                <Icon type={notification.type} />
            </div>
            <div className="pl-4 col-span-7 text-sm font-normal">
                <time className='text-gray-900 text-xs' >{moment(notification.createdAt?.toDate()).fromNow()}</time>
                <div className="">{notification.message}</div>
            </div>
        </div>
    )
}

export default NotificationCard