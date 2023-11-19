// import { getFirestore } from "firebase";

const firebaseConfig = {};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { db, auth };
