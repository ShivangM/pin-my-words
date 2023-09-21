import { DocumentData, Timestamp } from 'firebase/firestore';
import { User } from './User';

export enum BoardAccess {
  READ_ONLY = 'read_only',
  READ_WRITE = 'read_write',
  ADMIN = 'admin',
  OWNER = 'owner',
}

export interface BoardUser extends User {
  access: BoardAccess;
}

export enum BoardModes {
  WORDS = 'words',
  ROOT_WORDS = 'root_words',
}

export interface Board {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  owner: string;

  totalWords: number;
  totalRootWords: number;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
