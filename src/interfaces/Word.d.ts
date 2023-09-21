import { DocumentReference, Timestamp } from 'firebase/firestore';
import { Option } from './Typings.d';

export enum AddWordSteps {
  ENTER_DETAILS,
  ENTER_EXAMPLES,
  ENTER_IMAGE,
}

export interface Word {
  _id: string;
  word: string;
  meaning: string;
  partOfSpeech: string[];
  roots?: Option[];
  examples?: string[];
  image?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

export interface RootWord {
  _id: string;
  description: string;
  root: string;
  type: string;
  meaning: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}
