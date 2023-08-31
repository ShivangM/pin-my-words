import { Timestamp } from 'firebase/firestore';

export interface Word {
  id: string;
  word: string;
  definition: string;
  image?: string;
  root?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}
