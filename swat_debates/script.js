try{
require('dotenv').config();
} catch (error) {console.log('Not applicable: ', error);}
const PORT = process.env.PORT || 5500;

document.addEventListener('DOMContentLoaded', function() {
    fetchDebates();
});


async function fetchDebates() {
    try {
        const response = await fetch(`${PORT}/api/debates`);
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
        const details = document.createElement('p');
        details.innerHTML = `Topic: ${element.topic} <br> Host: ${element.host} <br> When: <time datetime=YYYY-MM-DDThh:mm>${formatDateTime(element.when)}</time> <br> Location: ${element.where}`;
        debateItem.appendChild(details);
        debatesContainer.append(debateItem);
    });
}