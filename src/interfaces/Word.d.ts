import { Timestamp } from 'firebase/firestore';

export interface Word {
  id: string;
  word: string;
  meaning: string;
  examples: string[];
  image?: string;
  root?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}
