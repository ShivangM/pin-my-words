export interface User {
  uid: string;
  name: string;
  email: string;
  totalBoards: number;
  image?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
