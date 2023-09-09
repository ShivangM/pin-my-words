import { Board, BoardAccess, CollaborativeUser, Metadata } from "@/interfaces/Board.d";
import db, { storage } from "@/utils/firebase";
import { Timestamp, addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const createBoardUsingUserId = async (metadata: Metadata, owner: string, image: File | null, users: CollaborativeUser[] | null): Promise<Board> => {
    let board: Board = {
        _id: '',
        metadata,
        owner,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    };

    try {
        const boardsCollection = collection(db, 'boards');
        const boardRef = await addDoc(boardsCollection, board);

        board = { ...board, _id: boardRef.id };

        if (users) {
            let addUserPromises: Promise<void>[] = [];

            users.forEach((user) => {
                const addUserPromise = setDoc(doc(db, 'users-boards', user.user.uid! + '_' + boardRef.id), {
                    boardId: boardRef.id,
                    userId: user.user.uid!,
                    access: user.access,
                });

                addUserPromises.push(addUserPromise);
            });

            await Promise.all(addUserPromises);
        }

        setDoc(doc(db, 'users-boards', owner + '_' + boardRef.id), {
            boardId: boardRef.id,
            userId: owner,
            access: BoardAccess.OWNER,
        });

        //Upload Image to Storage
        if (image) {
            const imageRef = ref(storage, 'boards/' + boardRef.id + "/" + "cover");
            const imageBlob = new Blob([image], { type: 'image/jpeg' });

            await uploadBytes(imageRef, imageBlob, {
                contentType: 'image/jpeg',
            }).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    updateDoc(boardRef, {
                        metadata: {
                            ...metadata,
                            image: downloadURL,
                        },
                    });

                    board = {
                        ...board,
                        metadata: {
                            ...metadata,
                            image: downloadURL,
                        },
                    } as Board;
                });
            });
        }

        return board;
    } catch (error) {
        throw error;
    }
}

export default createBoardUsingUserId;