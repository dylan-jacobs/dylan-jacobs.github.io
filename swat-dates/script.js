import { MatchRequest } from './Classes/matchRequest.js';
import { writeMatchRequest, login, signUp, listenForLoginChanges, signout, getMatchRequest, getAllMatchRequests } from './firebase.js';
import { showPopup, hidePopup } from './helper_functions.js';
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

const matchRequestPairKeyFn = pair => `${pair[0]}-${pair[1]}`;

const frequencyResponseList = ["Never", "Rarely", "Monthly", "Weekly", "Daily"];
const comfortResponseList = ["Very uncomfy", "Somewhat uncomfy", "Neutral", "Somewhat comfy", "Very comfy"];
const importanceResponseList = ["Very unimportant", "Somewhat unimportant", "Neutral", "Somewhat important", "Very important"];
const preferenceResponseList = ["Strongly prefer not to", "Prefer not to", "Neutral", "Prefer", "Strongly prefer"];
const exlusivityVsPolyResponseList = ["Strongly prefer monogamy", "Prefer monogamy", "Prefer polyamory", "Strongly prefer polyamory"];
const freakyResponseList = ["Very vanilla", "Somewhat vanilla", "Neutral", "Somewhat freaky", "Freak-a-LICCIOUS"];

const substanceQuestions = {
    // Alcohol
    "How often do you drink alcohol?": listToScaledMap(frequencyResponseList),
    "Comfort around people who drink": listToScaledMap(comfortResponseList),
    "Importance of similar drinking habits": listToScaledMap(importanceResponseList),
  
    // Cannabis
    "Cannabis use frequency": listToScaledMap(frequencyResponseList),
    "Comfort with cannabis use around you": listToScaledMap(comfortResponseList),
    "Importance of cannabis compatibility": listToScaledMap(importanceResponseList),

    "Tobacco/Nicotine use frequency": listToScaledMap(frequencyResponseList),
    "Comfort with tobacco/nicotine use around you": listToScaledMap(comfortResponseList),
    "Importance of tobacco/nicotine compatibility": listToScaledMap(importanceResponseList),
  
    // Other Drugs
    "How often do you try substances other than alcohol/cannabis": listToScaledMap(frequencyResponseList),
    "Are you ok with partner experimenting with drugs stronger than alcohol/cannabis/nicotine?": listToScaledMap(comfortResponseList),
  
    // Lifestyle & Boundaries
    "Prefer substance-free environments": listToScaledMap(preferenceResponseList),
    "How comfortable are you around alcohol/drugs?": listToScaledMap(comfortResponseList),
    "Importance of sobriety day-to-day": listToScaledMap(importanceResponseList)
};

const sexualityQuestions = {
    "How often do you engage in sexual activity?": listToScaledMap(frequencyResponseList),
    "How important is sex in your relationships?": listToScaledMap(importanceResponseList),
    "How freaky are you?": listToScaledMap(freakyResponseList),
    "Monogomy vs polyamory?": listToScaledMap(exlusivityVsPolyResponseList),
    "How important is relationship exclusivity?": listToScaledMap(importanceResponseList)
};

const radioButtonKeyFn = (question) => `radio-input-${question.replaceAll(' ', '-').replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase()}`;

document.addEventListener('DOMContentLoaded', () => {
    window.showPopup = showPopup;
    window.hidePopup = hidePopup;
    window.logout = logout;

    listenForLoginChanges(onLoginSuccess, onLoginFailure);
    initLoginPopup();
    initSignupPopup();

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

function createInputSlider(pair) {
    const numSteps = 6;
    const min = -1; 
    const max = 1;
    const inputRangeStep = (max - min) / (numSteps - 1); 
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
    input.min = `${min}`;
    input.step = `${inputRangeStep}`;
    input.max = `${max}`;
    input.value = `0`; // Default to the middle value
    input.setAttribute("list", "tickmarks");

    // add tickmarks
    const datalist = document.createElement("datalist");
    datalist.id = "tickmarks";
    for (var i = 0; i <= numSteps; i++) {
        const option = document.createElement("option");
        option.value = `${min + i * inputRangeStep}`;
        datalist.appendChild(option);
    }

    // append children elements
    sliderRow.appendChild(datalist);
    sliderRow.appendChild(leftLabel);
    sliderRow.appendChild(input);
    sliderRow.appendChild(rightLabel);

    return {sliderRow, label};
}

function createRadioGroup(question, options) {
    const container = document.createElement('div');
    container.className = 'match-request-form-element-container';

    // add question label
    const label = document.createElement('label');
    label.className = 'label form-label';
    label.textContent = question;
    container.appendChild(label);

    // add radio buttons
    const radioGroup = document.createElement('div');
    radioGroup.className = 'radio-group';
    radioGroup.id = radioButtonKeyFn(question); // Set ID for the group
    container.appendChild(radioGroup);

    Object.keys(options).forEach(option => {
        const mappedValue = options[option]; // Get the mapped value for the option
        const radioContainer = document.createElement('div');
        
        const input = document.createElement('input');
        input.id = `${radioButtonKeyFn(question)}-${mappedValue}`; // create unique ids for each option
        input.type = 'radio';
        input.name = question; // Group by question
        input.value = mappedValue;
        if (mappedValue === 0) {
            input.setAttribute('required', "");
        }
        
        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.textContent = option;

        radioContainer.appendChild(input);
        radioContainer.appendChild(label);
        radioGroup.appendChild(radioContainer);
    });
    return container;
}
  
function createMatchRequestForm(user) {
    const matchForm = document.getElementById('match-form');
    // toggle pages
    let currentPage = 0;
    const pages = document.querySelectorAll('.form-step');

    // page 1 (personality)
    traitPairs.forEach(pair => {
        const container = document.createElement('div');
        container.className = 'match-request-form-element-container';
        pages[0].append(container);

        const {sliderRow, label} = createInputSlider(pair);
        container.append(label);
        container.append(sliderRow);
    });
    addNextButton(pages[0], 1); // Add next button to page 1

    // drug page
    const drugPageTitle = document.createElement('h2');
    drugPageTitle.textContent = "Sober thoughts become drunk actions...";
    pages[1].appendChild(drugPageTitle);

    for (const question in substanceQuestions) {
        const options = substanceQuestions[question];
        const container = createRadioGroup(question, options);
        pages[1].appendChild(container);
    }

    // append prev/next buttons
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    pages[1].appendChild(buttonGroup);
    addPrevButton(buttonGroup, 2); // Add previous button to page 2
    addNextButton(buttonGroup, 2); // Add next button to page 2

    // sex page
    const sexPageTitle = document.createElement('h2');
    sexPageTitle.textContent = "Now for the juicy stuff...";
    pages[2].appendChild(sexPageTitle);

    for (const question in sexualityQuestions) {
        const options = sexualityQuestions[question];
        const container = createRadioGroup(question, options);
        pages[2].appendChild(container);
    }
    addPrevButton(pages[2], 3); // Add previous button to page 2

    // submit
    const prevButtons = document.querySelectorAll('.match-form-prev-btn');
    const nextButtons = document.querySelectorAll('.match-form-next-btn');
    matchForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        showPopup('loader-popup');

        // get page 1 traits
        const entries = traitPairs.map(pair => {
            const input = document.getElementById(`slider-${pair[0]}-${pair[1]}`);
            if (input) {
                return [matchRequestPairKeyFn(pair), parseFloat(input.value, 10)];
            }
        });
        var traitsMap = new Map(entries);

        // get drug radio inputs
        const substanceMap = new Map();
        Object.keys(substanceQuestions).forEach(question => {
            const radioGroup = document.getElementById(radioButtonKeyFn(question));
            if (!radioGroup) { return; }
            const radioInput = radioGroup.querySelector('input[type="radio"]:checked'); // get checked input
            substanceMap.set(question, radioInput ? parseFloat(radioInput.value) : null);
        });

        // get sex radio inputs
        const sexualityMap = new Map();
        Object.keys(sexualityQuestions).forEach(question => {
            const radioGroup = document.getElementById(radioButtonKeyFn(question));
            if (!radioGroup) { return; }
            const radioInput = radioGroup.querySelector('input[type="radio"]:checked'); // get checked input
            sexualityMap.set(question, radioInput ? parseFloat(radioInput.value) : null);
        });

        var matchRequest = new MatchRequest(user, traitsMap, substanceMap, sexualityMap);

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
        window.scrollTo(0, 0); // Scroll to top of page
    }
    function nextPage() {
        if (currentPage < pages.length - 1) {
            currentPage++;
            showPage(currentPage);
        }
        window.scrollTo(0, 0); // Scroll to top of page
    }

    function addNextButton(page, id) {
        const nextButton = document.createElement('button');
        nextButton.className = 'match-form-next-btn';
        nextButton.id = `next-btn-${id}`;
        nextButton.textContent = 'Next';
        nextButton.type = 'button'; // Prevents form submission
        page.appendChild(nextButton);
    }

    function addPrevButton(page, id) {
        const prevButton = document.createElement('button');
        prevButton.className = 'match-form-prev-btn';
        prevButton.id = `prev-btn-${id}`;
        prevButton.textContent = 'Previous';   
        prevButton.type = 'button'; // Prevents form submission
        page.appendChild(prevButton);
    }

    showPage(currentPage); // Show the first page initially
}

function logout() {
    signout().then(() => window.location.reload());
}

function initLoginPopup() {
    const form = document.getElementById('login-form');
    const errorElement = document.getElementById('login-error');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission
        errorElement.style.display = 'none'; 
        
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('psw');
        login(email, password)
        .catch((error) => {
                showError('Login failed. Please check your email and password.');
            });
    });
    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function initSignupPopup() {
    const form = document.getElementById('signup-form');
    const errorElement = document.getElementById('signup-error');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
      
        const formData = new FormData(event.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('psw');

        errorElement.style.display = 'none';

        if (!name.includes(' ')) {
            showError('Please provide your full name.');
            return;
        }
      
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

        /*if (!email.endsWith('@swarthmore.edu')) {
            showError('Please use your Swarthmore email address.');
            return;
        }*/
      
        signUp(email, password, name)
          .then(async (user) => {
            login(email, password);
        })
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

function onLoginSuccess(user) {
    createMatchRequestForm(user);
    displayMatchedUsers(user);

    console.log('onLoginSuccessCallback called');

    hidePopup('login-popup');
    hidePopup('signup-popup');
    const profileButton = document.getElementById('profile-btn');
    profileButton.style.display = 'block';
    const profileButtonImg = document.getElementById('profile-btn-img');
    profileButtonImg.src = user.photoURL;
    document.getElementById('profile-popup-name').textContent = user.displayName;

    // show/hide stuff
    document.getElementById('please-login-container').style.display = 'none';
    document.getElementById('match-request-form-container').style.display = 'block';
    document.getElementById('matches-container').style.display = 'block';
    document.getElementById('login-btn').style.display = 'none';
    console.log('User logged in.');
}

function onLoginFailure() {
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

function getMostRecentMatchRequest(user) {
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
    const matchesContainer = document.getElementById('matches-container');
    matchesContainer.innerHTML = ''; // Clear previous matches
    const heading = document.createElement('h1');
    heading.textContent = 'Your weekly matches';
    matchesContainer.appendChild(heading);
    matchesContainer.appendChild(document.createElement('br'));
    getMatchRequest(user.userUID) // get the user's current match request to compare against all others
        .then(async (matchRequest) => {
            if (!matchRequest) {
                console.log("No match request found for user:", user.userUID);
                const consolation = document.createElement('p');
                consolation.textContent = "You have not yet submitted a match request. Please fill out the form to find matches!";
                matchesContainer.appendChild(consolation);
                return;
            }
            // const traits = Array.from(matchRequest.traits.values());
            const traits = traitPairs.map(pair => matchRequest.traits.get(matchRequestPairKeyFn(pair)) ?? 0);

            getAllMatchRequests().then((allMatchRequests) => {
                
                allMatchRequests.forEach((matchRequest) => {

                    const otherUser = matchRequest.user;

                    if (otherUser.userUID == user.userUID) { // skip yourself
                        return;
                    }

                    const otherTraits = traitPairs.map(pair => matchRequest.traits.get(matchRequestPairKeyFn(pair)) ?? 0);
                    const similarity = (dotProduct(traits, otherTraits) + 1) / 2; // normalize to [0, 1]

                    // add to matches container
                    const matchItem = document.createElement('div');
                    matchItem.className = 'row-item center-items-vertically';
                    const matchName = document.createElement('h3');
                    matchName.textContent = matchRequest.user.displayName;
                    const similarityText = document.createElement('h3');
                    similarityText.textContent = `Similarity: ${(similarity*100).toFixed(2)}%`;
                    const email = document.createElement('p');
                    email.textContent = matchRequest.user.email;

                    const matchButton = document.createElement('button');
                    matchButton.textContent = "I'm down";

                    const linebreak = document.createElement('div');
                    linebreak.className = 'break';

                    const datesText = document.createElement('p');
                    datesText.innerHTML = '<b>Date ideas:</b>';
                    for (const dateIdea in user.dateIdeas) {
                        datesText.innerHTML += `\n • ${dateIdea}`;
                    }

                    const jokeText = document.createElement('p');
                    for (const joke in user.jokes) {
                        jokeText.innerHTML += `\n • ${joke}`;
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
    //TODO
}

function dotProduct(a, b){
    if (a.length !== b.length) {
        return -1;
    }
    const magA = Math.sqrt(a.reduce((sum, val) => sum + (val * val), 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + (val * val), 0));
    const dotProduct = a.reduce((sum, val, i) => sum + (val * b[i]), 0);
    if (magA === 0 && magB === 0) return 1; // Both vectors are zero, return 1 for similarity
    if (magA === 0 || magB === 0) return 0; // Avoid division by zero
    return dotProduct / (magA*magB);
}

function mapRange(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function listToScaledMap(list) {
    const step = 2 / (list.length - 1); // scale to range [-1, 1]
    return Object.fromEntries(
        list.map((entry, index) => [entry, -1 + (step * index)])
    );
}