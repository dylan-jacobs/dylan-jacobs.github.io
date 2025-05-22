const url = 'https://swat-debates.onrender.com'; // prod
//const url = 'http://localhost:5500'; // dev

document.addEventListener('DOMContentLoaded', function() {
    fetchDebates();
});

initSignup();


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

    debateTitle.innerHTML = debate.topic;
    debateTopic.innerHTML = `Debate topic: ${debate.topic} hosted by ${debate.host}`;
    debateTime.innerHTML = `When: <time datetime=YYYY-MM-DDThh:mm>${formatDateTime(debate.when)}</time>`
    debateLocation.innerHTML = debate.where;
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

function initSignup(){
    const form = document.getElementById('signup-form');
    form.addEventListener('submit', (event) => {
        const password = event.target.password.value;
        if (!isValidPassword(password)) {
            alert('Password does not meet security criteria.');
            event.preventDefault();
        }
    });
    function isValidPassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }
}