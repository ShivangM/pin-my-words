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
};

export interface Board {
  _id: string;
  name: string;
  owner: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  description?: string;
  image?: string;
}
