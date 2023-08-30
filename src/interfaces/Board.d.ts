import { DocumentData, Timestamp } from 'firebase/firestore';

export enum CreateBoardSteps {
  ENTER_DETAILS,
  SELECT_THUMBNAIL,
  INVITE_USERS,
}

export enum BoardAccess {
  READ_ONLY = 'read_only',
  READ_WRITE = 'read_write',
  ADMIN = 'admin',
}

export type CollaborativeUser = {
  email: string;
  access: BoardAccess;
};

export interface Metadata {
  name: string;
  description?: string;
  image?: string;
}

export interface Board extends DocumentData {
  _id: string;
  metadata: Metadata;
  users: User[];
  owner: User;
  createdAt: Timestamp;
}
