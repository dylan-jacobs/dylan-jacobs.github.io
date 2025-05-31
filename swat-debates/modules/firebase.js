// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
apiKey: "AIzaSyCMmG0vA65h5V7bvdTvfmYRhIuLgr81u8M",
authDomain: "swat-debates.firebaseapp.com",
projectId: "swat-debates",
storageBucket: "swat-debates.firebasestorage.app",
messagingSenderId: "522185643387",
appId: "1:522185643387:web:d7b8b16fa215497a7a59de",
measurementId: "G-Q8597M568L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is signed in:", user);
    } else {
        console.log("No user is signed in.");
    }
});

async function signUp(email, password) {
    try {
        const auth = getAuth(app);
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
        return userCredential.user;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
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

export function initSignup(){
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
      
        signUp(email, password)
          .then((user) => login(email, password))
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

export function initLogin() {
    const form = document.getElementById('login-form');
    const errorElement = document.getElementById('login-error');
    errorElement.style.display = 'none'; 

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('psw');
        login(email, password).then((user) => {
            console.log("User logged in:", user);
        }).catch((error) => {
            showError('Login failed. Please check your email and password.');
        });
    });
    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}