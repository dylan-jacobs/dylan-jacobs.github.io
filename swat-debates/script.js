const url = 'https://swat-debates.onrender.com';

document.addEventListener('DOMContentLoaded', function() {
    fetchDebates();
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
        debateItem.addEventListener('click', () => showPopup(element));
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
// Show the popup
function showPopup(debate) {
    const debateTitle = document.getElementById('debate-title');
    const debateTopic = document.getElementById('debate-topic');
    const debateTime = document.getElementById('debate-time');
    const debateLocation = document.getElementById('debate-location');

    debateTitle.innerHTML = debate.topic;
    debateTopic.innerHTML = `Debate topic: ${debate.topic} hosted by ${debate.host}`;
    debateTime.innerHTML = `When: <time datetime=YYYY-MM-DDThh:mm>${formatDateTime(debate.when)}</time>`
    debateLocation.innerHTML = debate.where;
    document.getElementById('popup').style.display = 'flex';

}

// Hide the popup
function hidePopup() {
    document.getElementById('popup').style.display = 'none';
}

// Close the popup when clicking outside the content
window.onclick = function(event) {
    const popup = document.getElementById('popup');
    if (event.target === popup) {
        hidePopup();
    }
};