import { IconType } from 'react-icons/lib';

export interface Feature {
  name: string;
  description: string;
  Icon: IconType;
}

export interface Option {
  label: string;
  value: string;
}

export interface CommonLink {
  label: string;
  href: string;
  Icon?: IconType;
}
