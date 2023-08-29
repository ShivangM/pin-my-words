import { DocumentData } from 'firebase/firestore';

enum BoardType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

enum BoardAccess {
  READ_ONLY = 'read_only',
  READ_WRITE = 'read_write',
  ADMIN = 'admin',
}

interface Board extends DocumentData {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  type: BoardType;
  users: User[];
  owner: User;
}
