import { MatchRequest } from './Classes/matchRequest.js';
import { writeMatchRequest, initLogin, initSignup } from './firebase.js';

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

var user = "dylan"; // Placeholder for user object, to be set on login

document.addEventListener('DOMContentLoaded', () => {
    window.showPopup = showPopup;
    window.hidePopup = hidePopup;

    initLogin(onLoginSuccess, onLoginFailure);
    initSignup(onLoginSuccess, onLoginFailure);
    createMatchRequestForm();
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
        const inputRangeStep = 0.142857;
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
        user="dylan";
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

function onLoginSuccess(u) {
    user = u;
    hidePopup('login-popup');
    document.getElementById('profile-btn').style.display = 'block';
    document.getElementById('login-btn').style.display = 'none';
    console.log('User logged in:', user);
}

function onLoginFailure() {
    user = null;
    document.getElementById('login-btn').style.display = 'block';
    document.getElementById('profile-btn').style.display = 'none';
    console.log('User not logged in or login failed');
}

