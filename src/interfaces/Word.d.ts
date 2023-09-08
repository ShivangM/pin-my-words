import { Timestamp } from 'firebase/firestore';

export enum AddWordSteps {
  ENTER_DETAILS,
  ENTER_EXAMPLES,
  ENTER_IMAGE,
}

export interface Word {
  id: string;
  word: string;
  meaning: string;
  partOfSpeech: string[];
  roots?: string[];
  examples: string[];
  image?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}


export interface RootWord {
  id: string;
  description: string;
  root: string;
  type: string;
  meaning: string;
}