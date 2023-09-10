import db from "@/utils/firebase";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const fetchUser = async (userId: string): Promise<User> => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        throw new Error('User does not exist');
    }

    const userData = userDoc.data() as User;
    return userData;
}

export default fetchUser;