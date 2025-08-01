import { MatchRequest } from './Classes/matchRequest.js';
import { writeMatchRequest, initLogin, initSignup, signout } from './firebase.js';

import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const traitPairs = [
    ["Adaptable", "Rigid"],
    ["Affectionate", "Withdrawn"],
    ["Alert", "Oblivious"],
    ["Ambitious", "Unmotivated"],
    ["Appreciative", "Ungrateful"],
    ["Bold", "Timid"],
    ["Calm", "Energetic"],
    ["Cautious", "Reckless"],
    ["Centered", "Scatterbrained"],
    ["Charming", "Antisocial"],
    ["Cooperative", "Independent"],
    ["Creative", "Unimaginative"],
    ["Curious", "Indifferent"],
    ["Decisive", "Indecisive"],
    ["Diplomatic", "Rude"],
    ["Discreet", "Inattentive"],
    ["Easygoing", "Strict"],
    ["Efficient", "Sluggish"],
    ["Empathetic", "Callous"],
    ["Extroverted", "Introverted"],
    ["Flirtatious", "Modest"],
    ["Friendly", "Antisocial"],
    ["Funny", "Serious"],
    ["Generous", "Stingy"],
    ["Gentle", "Rough"],
    ["Honest", "Dishonest"],
    ["Honorable", "Cowardly"],
    ["Humble", "Proud"],
    ["Idealistic", "Realistic"],
    ["Industrious", "Lazy"],
    ["Innocent", "Dirty-minded"],
    ["Just", "Partial"],
    ["Kind", "Cold"],
    ["Loyal", "Unreliable"],
    ["Mature", "Immature"],
    ["Meticulous", "Careless"],
    ["Obedient", "Rebellious"],
    ["Optimistic", "Pessimistic"],
    ["Organized", "Messy"],
    ["Passionate", "Indifferent"],
    ["Perceptive", "Ignorant"],
    ["Philosophical", "Shallow"],
    ["Private", "Sociable"],
    ["Proactive", "Stagnant"],
    ["Professional", "Inept"],
    ["Protective", "Negligent"],
    ["Quirky", "Conventional"],
    ["Responsible", "Irresponsible"],
    ["Sensible", "Foolish"],
    ["Sentimental", "Pragmatic"],
    ["Sophisticated", "Unrefined"],
    ["Spiritual", "Irreverent"],
    ["Spontaneous", "Deliberate"],
    ["Spunky", "Apathetic"],
    ["Thrifty", "Extravagant"],
    ["Traditional", "Modern"],
    ["Trusting", "Wary"],
    ["Uninhibited", "Careful"],
    ["Whimsical", "Serious"],
    ["Wholesome", "Indecent"],
    ["Wise", "Unaware"]
  ];

var user = null; // Placeholder for user object, to be set on login

document.addEventListener('DOMContentLoaded', () => {
    window.showPopup = showPopup;
    window.hidePopup = hidePopup;
    window.logout = logout;

    initLogin(onLoginSuccess, onLoginFailure);
    initSignup(onLoginSuccess, onLoginFailure);
    createMatchRequestForm();
    getTimeUntilNextDate();
});


// Close the popup when clicking outside the content
window.onclick = function(event) {
    var popups = document.getElementsByClassName('popup'); // 'popup' is the generic class for all popups
    for (let i = 0; i < popups.length; i++){
        if (event.target === popups[i]) {
            hidePopup(popups[i].id);
        }
    }
};
  
function createMatchRequestForm() {
    const matchForm = document.getElementById('match-form');
    traitPairs.forEach(pair => {
        const inputRangeStep = 0.142857; // 7 steps
        const container = document.createElement('div');
        container.className = 'form-element-container';

        const label = document.createElement('label');
        label.className = 'label form-label';
        label.textContent = `${pair[0]} vs ${pair[1]}`;

        const sliderRow = document.createElement('div');
        sliderRow.className = 'row slider-row';

        const leftLabel = document.createElement('span');
        leftLabel.textContent = pair[0];
        const rightLabel = document.createElement('span');
        rightLabel.textContent = pair[1];
        
        const input = document.createElement('input');
        input.className = 'range'
        input.id = `slider-${pair[0]}-${pair[1]}`
        input.type = 'range';
        input.min = '0';
        input.step = `${inputRangeStep}`;
        input.max = '1';
        input.value = `${Math.floor(input.max/(2*inputRangeStep)) * inputRangeStep}`; // Default to the middle value
        
        matchForm.appendChild(container);
        container.appendChild(label);
        container.appendChild(sliderRow);
        sliderRow.appendChild(leftLabel);
        sliderRow.appendChild(input);
        sliderRow.appendChild(rightLabel);
    });
    const submitButton = document.getElementById('submit-btn');
    submitButton.addEventListener('click', async () => {
        showPopup('loader-popup');
        var traitsMap = new Map();
        traitPairs.forEach(pair => {
            const input = document.getElementById(`slider-${pair[0]}-${pair[1]}`);
            if (input) {
                traitsMap.set(`${pair[0]}-${pair[1]}`, parseFloat(input.value, 10));
            }
        });
        var matchRequest = new MatchRequest(user, traitsMap);
        writeMatchRequest(matchRequest).then(() => {
            console.log("Match request submitted successfully.");
            hidePopup('loader-popup');
        }).catch((error) => {
            console.error("Error submitting match request:", error);
            hidePopup('loader-popup');
        });
    });
}

function showPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'flex';
    }
}
function hidePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'none';
    }
}

function logout() {
    signout().then(() => window.location.reload());
}

function onLoginSuccess(u) {
    user = u;
    hidePopup('login-popup');
    const profileButton = document.getElementById('profile-btn');
    profileButton.style.display = 'block';
    const profileButtonImg = document.getElementById('profile-btn-img');
    profileButtonImg.src = user.photoURL

    // show/hide stuff
    document.getElementById('please-login-container').style.display = 'none';
    document.getElementById('match-request-form-container').style.display = 'block';
    document.getElementById('matches-container').style.display = 'block';
    document.getElementById('login-btn').style.display = 'none';
    console.log('User logged in.');
}

function onLoginFailure() {
    user = null;

    // show/hide stuff
    document.getElementById('login-btn').style.display = 'block';
    document.getElementById('profile-btn').style.display = 'none';
    document.getElementById('please-login-container').style.display = 'flex';
    document.getElementById('match-request-form-container').style.display = 'none';
    document.getElementById('matches-container').style.display = 'none';
    console.log('User not logged in or login failed');
}


function getTimeUntilNextDate() {
    const time = new Date();
    const nextSunday = new Date(time);
    const day = time.getDay();

    let daysUntilNextSunday = (7 - day) % 7;

    if (day === 0 && time.getHours() < 8) {
        daysUntilNextSunday = 0;
    }

    nextSunday.setDate(time.getDate() + daysUntilNextSunday);
    nextSunday.setHours(8, 0, 0, 0); // Set to next Sunday at 8:00 AM
    const countdownElement = document.getElementById('new-dates-timer');

    const interval = setInterval(() => {
        const now = new Date();
        const timeDifferenceMs = nextSunday - now;
        if (timeDifferenceMs <= 0) {
            clearInterval(interval);
            countdownElement.textContent = "New dates released!!";
            document.location.reload(); // Reload the page to fetch new dates
            return;
        }
        const seconds = Math.floor(timeDifferenceMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const pad = (n) => n.toString().padStart(2, '0');
        countdownElement.textContent = `New dates released in ${(days)} days, ${(hours % 24)} hours, ${(minutes % 60)} minutes, and ${(seconds % 60)} seconds, but who's counting?!`;
    }
    , 1000);
}
