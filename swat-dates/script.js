import { MatchRequest } from './Classes/matchRequest.js';
import { writeMatchRequest, initLogin, initSignup, signout, getMatchRequest, getAllMatchRequests } from './firebase.js';

import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const largeListOfTraitPairs = [
    ["Adaptable", "Structured"],
    ["Affectionate", "Reserved"],
    ["Alert", "Calm"],
    ["Ambitious", "Content"],
    ["Appreciative", "Objective"],
    ["Bold", "Cautious"],
    ["Calm", "Energetic"],
    ["Cautious", "Daring"],
    ["Centered", "Dynamic"],
    ["Charming", "Sincere"],
    ["Cooperative", "Independent"],
    ["Creative", "Practical"],
    ["Curious", "Grounded"],
    ["Decisive", "Deliberative"],
    ["Diplomatic", "Direct"],
    ["Discreet", "Expressive"],
    ["Easygoing", "Principled"],
    ["Efficient", "Process-focused"],
    ["Empathetic", "Analytical"],
    ["Extroverted", "Introverted"],
    ["Flirtatious", "Modest"],
    ["Friendly", "Self-contained"],
    ["Funny", "Serious"],
    ["Generous", "Self-preserving"],
    ["Gentle", "Tough"],
    ["Honest", "Tactful"],
    ["Honorable", "Pragmatic"],
    ["Humble", "Confident"],
    ["Idealistic", "Realistic"],
    ["Industrious", "Relaxed"],
    ["Innocent", "Worldly"],
    ["Just", "Flexible"],
    ["Kind", "Blunt"],
    ["Loyal", "Independent-minded"],
    ["Mature", "Playful"],
    ["Meticulous", "Big-picture-focused"],
    ["Obedient", "Autonomous"],
    ["Optimistic", "Cautious"],
    ["Organized", "Flexible"],
    ["Passionate", "Even-tempered"],
    ["Perceptive", "Unshaken"],
    ["Philosophical", "Practical"],
    ["Private", "Open"],
    ["Proactive", "Reflective"],
    ["Professional", "Easygoing"],
    ["Protective", "Trusting"],
    ["Quirky", "Traditional"],
    ["Responsible", "Adventurous"],
    ["Sensible", "Imaginative"],
    ["Sentimental", "Pragmatic"],
    ["Sophisticated", "Down-to-earth"],
    ["Spiritual", "Rational"],
    ["Spontaneous", "Deliberate"],
    ["Spunky", "Serene"],
    ["Thrifty", "Generous"],
    ["Traditional", "Modern"],
    ["Trusting", "Skeptical"],
    ["Uninhibited", "Measured"],
    ["Whimsical", "Grounded"],
    ["Wholesome", "Edgy"],
    ["Wise", "Curious"],
    ["Reflective", "Action-oriented"],
    ["Consistent", "Adaptive"],
    ["Emotion-guided", "Logic-guided"],
    ["Competitive", "Cooperative"],
    ["Risk-tolerant", "Risk-averse"],
    ["Idealistic", "Pragmatic"],
    ["Big-picture-focused", "Detail-focused"]
  ]; // save for later

const traitPairs = [
    ["Adaptable", "Structured"],
    ["Affectionate", "Reserved"],
    ["Ambitious", "Content"],
    ["Bold", "Cautious"],
    ["Calm", "Energetic"],
    ["Charming", "Sincere"],
    ["Creative", "Practical"],
    ["Curious", "Grounded"],
    ["Decisive", "Deliberative"],
    ["Diplomatic", "Direct"],
    ["Empathetic", "Analytical"],
    ["Extroverted", "Introverted"],
    ["Friendly", "Self-contained"],
    ["Funny", "Serious"],
    ["Generous", "Self-preserving"],
    ["Gentle", "Tough"],
    ["Honest", "Tactful"],
    ["Humble", "Confident"],
    ["Idealistic", "Realistic"],
    ["Industrious", "Relaxed"],
    ["Loyal", "Independent-minded"],
    ["Meticulous", "Big-picture-focused"],
    ["Optimistic", "Cautious"],
    ["Organized", "Flexible"],
    ["Passionate", "Even-tempered"],
    ["Private", "Open"],
    ["Quirky", "Traditional"],
    ["Responsible", "Adventurous"],
    ["Sensible", "Imaginative"],
    ["Spontaneous", "Deliberate"]
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
    // toggle pages
    let currentPage = 0;
    const pages = document.querySelectorAll('.form-step');
    const prevButtons = document.querySelectorAll('.match-form-prev-btn');
    const nextButtons = document.querySelectorAll('.match-form-next-btn');

    traitPairs.forEach(pair => {
        const inputRangeStep = 0.285714; // 7 steps
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
        input.min = '-1';
        input.step = `${inputRangeStep}`;
        input.max = '1';
        input.value = `${Math.floor((input.max - input.min)/(2*inputRangeStep)) * inputRangeStep - input.max}`; // Default to the middle value
        
        pages[0].insertBefore(container, pages[0].firstChild);
        container.appendChild(label);
        container.appendChild(sliderRow);
        sliderRow.appendChild(leftLabel);
        sliderRow.appendChild(input);
        sliderRow.appendChild(rightLabel);
    });
    
    matchForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        showPopup('loader-popup');

        // get traits
        var traitsMap = new Map();
        traitPairs.forEach(pair => {
            const input = document.getElementById(`slider-${pair[0]}-${pair[1]}`);
            if (input) {
                traitsMap.set(`${pair[0]}-${pair[1]}`, parseFloat(input.value, 10));
            }
        });

        // get text inputs
        const formData = new FormData(event.target);
        const date1 = formData.get("date1");
        const date2 =  formData.get("date2");
        const date3 = formData.get("date3");
        const joke = formData.get("joke");

        var matchRequest = new MatchRequest(user.uid, user.displayName, user.email, traitsMap, [date1, date2, date3], joke);

        writeMatchRequest(matchRequest).then(() => {
            console.log("Match request submitted successfully.");
            hidePopup('loader-popup');
        }).catch((error) => {
            console.error("Error submitting match request:", error);
            hidePopup('loader-popup');
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', prevPage);
    });
    nextButtons.forEach(button => {
        button.addEventListener('click', nextPage);
    });

    function showPage(index) {
        pages.forEach((page, i) => {
            page.style.display = (i === index) ? 'block' : 'none';
        });
        document.getElementById("submit-btn").style.display = (currentPage === pages.length - 1) ? 'block' : 'none';
    }

    function prevPage(){
        if (currentPage > 0) {
            currentPage--;
            showPage(currentPage);
        }
    }

    function nextPage() {
        if (currentPage < pages.length - 1) {
            currentPage++;
            showPage(currentPage);
        }
    }
    showPage(currentPage); // Show the first page initially
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
    displayMatchedUsers(user);

    hidePopup('login-popup');
    hidePopup('signup-popup');
    const profileButton = document.getElementById('profile-btn');
    profileButton.style.display = 'block';
    const profileButtonImg = document.getElementById('profile-btn-img');
    profileButtonImg.src = user.photoURL
    document.getElementById('profile-popup-name').textContent = user.displayName;

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

function getMostRecentMatchRequest() {
    getMatchRequest(user).then((matchRequest) => {
        if (matchRequest) {
            console.log("Match request found:", matchRequest);
            const matchesContainer = document.getElementById('most-recent-match-request');
            matchesContainer.style.display = 'block';
            const matchList = document.getElementById('match-list');
            matchList.innerHTML = ''; // Clear previous matches
            matchRequest.traits.forEach((value, key) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${key}: ${value}`;
                matchList.appendChild(listItem);
            });
        } else {
            console.log("No match request found for the user.");
        }
    });
}

function displayMatchedUsers(user) {
    getMatchRequest(user)
        .then(async (matchRequest) => {
            if (!matchRequest) {
                console.log("No match request found for user:", user.uid);
                return;
            }
            const traits = Array.from(matchRequest.traits.values());

            getAllMatchRequests(user).then((allMatchRequests) => {
                const matchesContainer = document.getElementById('matches-container');
                allMatchRequests.forEach((request) => {
                    if (request.userUID == user.uid) {
                        return;
                    }
                    const otherTraits = Array.from(request.traits.values());
                    const similarity = dotProduct(traits, otherTraits);
                    console.log(`Similarity with ${request.displayName}:`, similarity);

                    // add to matches container
                    const matchItem = document.createElement('div');
                    matchItem.className = 'row-item';
                    const matchName = document.createElement('h3');
                    matchName.textContent = request.displayName;
                    const similarityText = document.createElement('h3');
                    similarityText.textContent = `Similarity: ${similarity.toFixed(2)*100}%`;
                    const email = document.createElement('p');
                    email.textContent = request.email;

                    const matchButton = document.createElement('button');
                    matchButton.textContent = "I'm down";

                    const linebreak = document.createElement('div');
                    linebreak.className = 'break';

                    const datesText = document.createElement('p');
                    if (request.dateIdeas && request.dateIdeas.length == 3) {
                        datesText.innerHTML = `<b>Date ideas:</b> \n • ${request.dateIdeas[0]} \n • ${request.dateIdeas[1]} \n • ${request.dateIdeas[2]}`;
                    }

                    const jokeText = document.createElement('p');
                    if (request.joke) {
                        jokeText.innerHTML = `<b>Joke:</b> \n ${request.joke}`;
                    }
                    
                    matchItem.appendChild(matchName);
                    matchItem.appendChild(similarityText);
                    matchItem.appendChild(email);
                    matchItem.appendChild(matchButton);
                    matchItem.appendChild(linebreak);
                    matchItem.appendChild(datesText);
                    matchItem.appendChild(jokeText);
                    matchesContainer.appendChild(matchItem);
                });
            });
        });
}

function displayDateConfirmationPopup(request) {

}

function dotProduct(a, b){
    const magA = Math.sqrt(a.reduce((sum, val) => sum + (val * val), 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + (val * val), 0));
    const dotProduct = a.reduce((sum, val, i) => sum + (val * b[i]), 0);
    if (magA === 0 || magB === 0) return 0; // Avoid division by zero
    if (magA === 0 && magB === 0) return 1; // Both vectors are zero, return 1 for similarity
    return dotProduct / (magA*magB);
}