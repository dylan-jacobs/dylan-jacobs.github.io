// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
import { collection, addDoc, getDoc, getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { MatchRequest, MatchRequestConverter } from "./Classes/matchRequest.js";

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

async function signUp(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Signup failed:", error);
        throw error;
    }
}

async function login(email, password) {
    try {
        const auth = getAuth(app);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);
        return userCredential.user;
        
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export async function writeMatchRequest(matchRequest, timeout=5000) {
    const ref = doc(db, "matchRequests", matchRequest.user).withConverter(MatchRequestConverter);
    await withTimeout(setDoc(ref, matchRequest, { merge: true }), timeout);
  }

function withTimeout(promise, ms) {
    return Promise.race([promise, new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Operation timed out'));
        }
        , ms);
    })])
}
async function logout() {
    try {
        const auth = getAuth(app);
        await signOut(auth);
        console.log("User signed out successfully.");
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
}

export function initSignup(onSignupSuccessCallback, onSignupFailureCallback) {
    const form = document.getElementById('signup-form');
    const errorElement = document.getElementById('signup-error');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
      
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('psw');

        errorElement.style.display = 'none';
      
        if (!isValidEmail(email)) {
          showError('Please provide a valid email.');
            return;
        }

        if (!isValidPassword(password)) {
          showError('Password must have at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters.');
          return;
        }

        if (password !== formData.get('re-psw')) {
            showError('Passwords do not match.');
            return;
        }

        if (!email.endsWith('@swarthmore.edu')) {
            showError('Please use your Swarthmore email address.');
            return;
        }
      
        signUp(email, password)
          .then((user) => login(email, password)
            .then(() => {
                if (typeof onLoginSuccessCallback == 'function'){
                    onLoginSuccessCallback(user);
                }
            }))
          .catch((err) => {
            if (err.code === 'auth/email-already-in-use') {
                showError('Email already in use. Please try another email or if this is you, login instead.');
                return;
            }
            if (err.code === 'auth/invalid-email') {
                showError('Invalid email address. Please provide a valid email.');
                return;
            }
            showError('Sign-up failed');
          });
      });
    function isValidPassword(password) {
        // valid password has one uppercase letter, one lowercase letter, one digit, one special character, and is at least 8 characters long
        // const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        // valid password has one uppercase letter, one lowercase letter, one digit, and is at least 8 characters long
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
    }
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
      

    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

export function initLogin(onLoginSuccessCallback, onLoginFailureCallback) {

    onAuthStateChanged(auth, (user) => {
        if (user) {
            onLoginSuccessCallback(user);
        } else {
            onLoginFailureCallback(user);
        }
    });

    const form = document.getElementById('login-form');
    const errorElement = document.getElementById('login-error');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission
        errorElement.style.display = 'none'; 
        
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('psw');
        login(email, password)
        .then((user) => {
            if (typeof onLoginSuccessCallback == 'function'){
                onLoginSuccessCallback(user);
            }
        })
        .catch((error) => {
                showError('Login failed. Please check your email and password.');
            });
    });
    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}