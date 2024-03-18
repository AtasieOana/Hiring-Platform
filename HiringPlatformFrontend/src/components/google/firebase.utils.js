// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB5qGFndiXO9y-cd1UdT9EybJb8fYt9f8k",
    authDomain: "joblistic-b6c75.firebaseapp.com",
    projectId: "joblistic-b6c75",
    storageBucket: "joblistic-b6c75.appspot.com",
    messagingSenderId: "892683056546",
    appId: "1:892683056546:web:8b80aa66f836ecaf1e6efb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();

// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({
    prompt: "select_account "
});
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);