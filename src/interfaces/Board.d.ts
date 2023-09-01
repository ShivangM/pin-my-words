import { DocumentData, Timestamp } from 'firebase/firestore';

export enum CreateBoardSteps {
  ENTER_DETAILS,
  INVITE_USERS,
}

export enum BoardAccess {
  READ_ONLY = 'read_only',
  READ_WRITE = 'read_write',
  ADMIN = 'admin',
  OWNER = 'owner',
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

export interface Board {
  _id: string;
  metadata: Metadata;
  owner: User;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
