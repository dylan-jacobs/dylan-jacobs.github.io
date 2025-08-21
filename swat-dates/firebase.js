// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
import { collection, addDoc, getDoc, getFirestore, doc, setDoc, getDocs} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { MatchRequest, MatchRequestConverter } from "./Classes/matchRequest.js";
import { User, UserConverter } from "./Classes/user.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCc6qnCAjP0OBd1wg9U2DOt92XHXSHV3Nw",
    authDomain: "swatdates.firebaseapp.com",
    projectId: "swatdates",
    storageBucket: "swatdates.firebasestorage.app",
    messagingSenderId: "484928314771",
    appId: "1:484928314771:web:e75ed54afb20ea0af79c66",
    measurementId: "G-801WKB2SHS"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export async function signUp(email, password, displayName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = new User(userCredential.user.uid, displayName, userCredential.user.email, `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&size=128`, [], [], []); // add new user to db (just to store extra info like jokes and date ideas)
        writeUser(user);
        return user;
    } catch (error) {
        console.error("Signup failed:", error);
        throw error;
    }
}

export async function login(email, password) {
    try {
        const auth = getAuth(app);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in successfully:", userCredential.user.uid);
        
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export async function writeMatchRequest(matchRequest, timeout=5000) {
    const ref = doc(db, "matchRequests", matchRequest.user.userUID).withConverter(MatchRequestConverter);
    await withTimeout(setDoc(ref, matchRequest), timeout);
  }

export async function getMatchRequest(userUID, timeout=5000) {
    const ref = doc(db, "matchRequests", userUID).withConverter(MatchRequestConverter);
    const snapshot = await withTimeout(getDoc(ref), timeout);
    return snapshot.exists() ? snapshot.data() : null;
}

export async function getAllMatchRequests(timeout=20000) {
    const snapshot = await withTimeout(getDocs(collection(db, "matchRequests").withConverter(MatchRequestConverter)), timeout);
    
    const requests = [];
    snapshot.forEach((doc) => {
        requests.push(doc.data());
    });
    return requests;
}

function withTimeout(promise, ms) {
    return Promise.race([promise, new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Operation timed out'));
        }
        , ms);
    })])
}

export async function signout() {
    try {
        await signOut(auth);
        console.log("User signed out successfully.");
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
}

export function listenForLoginChanges(onLoginSuccessCallback, onLoginFailureCallback) {
    onAuthStateChanged(auth, (u) => {
        console.log("Auth state changed:", u);
        if (u) {
            getUser(u.uid).then((user) => {;
                onLoginSuccessCallback(user)
            });
        } else {
            onLoginFailureCallback();
        }
    });
}

export async function writeUser(user, timeout=5000) {
    const ref = doc(db, "users", user.userUID).withConverter(UserConverter);
    return withTimeout(setDoc(ref, user), timeout);
}

export async function getUser(userUID, timeout=5000) {
    const ref = doc(db, "users", userUID).withConverter(UserConverter);
    const snapshot = await withTimeout(getDoc(ref), timeout);
    return snapshot.exists() ? snapshot.data() : null;
}