import { Timestamp } from 'firebase/firestore';

export enum NotificationType {
  WORD_ADDED = 'WORD_ADDED',
  WORD_UPDATED = 'WORD_UPDATED',
  WORD_DELETED = 'WORD_DELETED',
  USER_ADDED = 'USER_ADDED',
  USER_REMOVED = 'USER_REMOVED',
  USER_UPDATED = 'USER_UPDATED',
  USER_LEFT = 'USER_LEFT',
  ROOT_WORD_ADDED = 'ROOT_WORD_ADDED',
  ROOT_WORD_UPDATED = 'ROOT_WORD_UPDATED',
  ROOT_WORD_DELETED = 'ROOT_WORD_DELETED',
  BOARD_UPDATED = 'BOARD_UPDATED',
}

export interface Notification {
  _id: string;
  type: NotificationType;
  message: string;

  createdBy: string;
  createdAt: Timestamp;
}
