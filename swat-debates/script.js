import { initLogin, initSignup } from './modules/firebase.js';

//const url = 'https://swat-debates.onrender.com'; // prod
 const url = 'http://localhost:5500'; // dev

var user = null; // global user variable

document.addEventListener('DOMContentLoaded', () => { // init website

    document.getElementById('debates-scheduler-container').style.display = 'none'; // hide until login
    document.getElementById('profile-btn').style.display = 'none'; // hide until login
    document.getElementById('login-btn').style.display = 'block'; // show login button

    fetchDebates();
    window.showPopup = showPopup;
    window.hidePopup = hidePopup;
    window.showHideCalendarView = showHideCalendarView;

    initLogin(onLoginSuccess());
    initSignup(onLoginSuccess());
});

async function fetchDebates() {
    try {
        const response = await fetch(`${url}/api/debates`);
        const debates = await response.json();
        displayDebates(debates);
    } catch (error) {
        console.error('Error fetching debates:', error);
    }
}

function formatDateTime(dateString){
    const weekDays = 
	['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const monthsArr = 
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
    const date = new Date(dateString);

    const currentDay = weekDays[date.getDay()];
    const currentDate  = date.getDate();
    const currentMonth  = monthsArr[date.getMonth()];
    const currentYear = date.getFullYear();
    const time = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    return `${currentDay} ${currentDate} ${currentMonth}, ${currentYear} at ${time}`;
}

function displayDebates(data) {
    const debatesContainer = document.getElementById('debates-container');

    data.forEach(element => {
        const debateItem = document.createElement('div');
        debateItem.classList.add('debate-item');
        debateItem.classList.add('clickable');
        debateItem.addEventListener('click', () => showDebatePopup(element));
        const details = document.createElement('p');
        debateItem.innerHTML = `
                Topic: ${element.topic}<br>
                Host: ${element.host}<br>
                When: <time datetime=YYYY-MM-DDThh:mm>${formatDateTime(element.when)}</time> <br>
                Location: ${element.where}
            `;        
        debateItem.appendChild(details);
        debatesContainer.append(debateItem);
    });

    const debatesLoader = document.getElementById('debates-loader');
    debatesLoader.style.display = 'none';
}

// popups!
// Show debate popup
function showDebatePopup(debate) {
    const debateTitle = document.getElementById('debate-title');
    const debateTopic = document.getElementById('debate-topic');
    const debateTime = document.getElementById('debate-time');
    const debateLocation = document.getElementById('debate-location');
    const registerButton = document.getElementById('debate-register-button');
    const registerButtonText = document.getElementById('debate-register-button-text');

    debateTitle.innerHTML = debate.topic;
    debateTopic.innerHTML = `Debate topic: ${debate.topic} hosted by ${debate.host}`;
    debateTime.innerHTML = `When: <time datetime=YYYY-MM-DDThh:mm>${formatDateTime(debate.when)}</time>`
    debateLocation.innerHTML = debate.where;

    if (user) { // user logged in --> can register
        registerButtonText.display.style = 'none';
        registerButton.style.display = 'flex';
        registerButton.onclick = registerForDebate(debate);  
    }  
    else { // not logged in --> prevent registration
        registerButtonText.display.style = 'flex';
        registerButton.style.display = 'none';
    }


    // finally, show debate popup
    document.getElementById('debate-popup').style.display = 'flex';

}

// Hide debate popup
function hidePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// login popup
function showPopup(popupId) {
    document.getElementById(popupId).style.display = 'flex';
}

// register the user for this debate
function registerForDebate(debate) {
    
}

// Close the popup when clicking outside the content
window.onclick = function(event) {
    var popups = document.getElementsByClassName('popup'); // 'popup' is the generic class for all popups
    for (let i = 0; i < popups.length; i++){
        if (event.target === popups[i]) {
            hidePopup(popups[i].id);
        }
    }
};

function showHideCalendarView(){
    const calendar = document.getElementById("airtable-calendar");
    const calendarViewToggle = document.getElementById("calendar-view-switch");
    if (calendarViewToggle.checked) {
        calendar.style.display = '';
    }
    else {
        calendar.style.display = 'none';
    }
}

export function onLoginSuccess(user) {
    user = user;
    hidePopup('login-popup');
    document.getElementById('debates-scheduler-container').style.display = 'block';
    document.getElementById('profile-btn').style.display = 'block';
    document.getElementById('login-btn').style.display = 'none';
    console.log('User logged in:', user);
}

export function onLoginFailure() {
    user = null;
    document.getElementById('debates-scheduler-container').style.display = 'none';
    document.getElementById('login-btn').style.display = 'block';
    document.getElementById('profile-btn').style.display = 'none';
    console.log('User not logged in or login failed');
}