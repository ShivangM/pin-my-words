import { IconType } from 'react-icons/lib';
import { Notification } from './Notification.d';

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

export interface PaginatedResponse<T> {
  data: T;
  hasMore: boolean;
  nextQuery?: Query<DocumentData, DocumentData>;
}

export interface ResponseWithNotification<T> {
  data: T;
  notification: Notification;
}
