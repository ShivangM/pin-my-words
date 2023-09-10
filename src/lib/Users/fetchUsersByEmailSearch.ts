import { User } from "@/interfaces/User";
import db from "@/utils/firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

const fetchUsersByEmailSearch = async (email: string): Promise<User[]> => {
    let users: User[] = []

    try {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('email', '==', email), limit(1));
        const userDocs = await getDocs(q);

        if (userDocs.empty) {
            throw new Error('No user found with that email');
        }

        userDocs.forEach((doc) => {
            const docData = doc.data();
            users.push({ ...docData, uid: doc.id } as User)
        });

        return users;
    } catch (error) {
        throw error;
    }
}

export default fetchUsersByEmailSearch;