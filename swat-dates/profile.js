import { listenForLoginChanges, signout } from './firebase.js';
import { showPopup, hidePopup } from './helper_functions.js';

document.addEventListener('DOMContentLoaded', () => {
    window.showPopup = showPopup;
    window.hidePopup = hidePopup;

    listenForLoginChanges(onLoginSuccess, onLoginFailure);
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

function updateProfileInfo(user) {

    // profile header
    const profileHeader = document.getElementById('profile-header-text');
    profileHeader.textContent = `Hey, ${user.displayName}!`;
    const profileEmail = document.getElementById('profile-header-email');
    profileEmail.textContent = user.email;

    // profile button
    const profileButton = document.getElementById('profile-btn');
    profileButton.style.display = 'block';
    const profileButtonImg = document.getElementById('profile-btn-img');
    profileButtonImg.src = user.photoURL;
    document.getElementById('profile-popup-name').textContent = user.displayName;

    // profile date ideas/jokes, etc.
    const profileDateIdeasContainer = document.getElementById('date-ideas-container');
    user.dateIdeas.forEach((idea, index) => {
        const ideaElement = document.createElement('li');
        ideaElement.textContent = idea;
        ideaElement.className = 'date-idea';
        ideaElement.id = `date-idea-${index}`;
        profileDateIdeasContainer.appendChild(ideaElement);
    })

    const profileJokeContainer = document.getElementById('jokes-container');
    user.jokes.forEach((joke, index) => {
        const jokeElement = document.createElement('li');
        jokeElement.textContent = joke;
        jokeElement.className = 'joke';
        jokeElement.id = `joke-${index}`;
        profileJokeContainer.appendChild(jokeElement);
    });

    const profileQuirksContainer = document.getElementById('quirks-container');
    user.quirks.forEach((quirk, index) => {
        const quirkElement = document.createElement('li');
        quirkElement.textContent = quirk;
        quirkElement.className = 'quirk';
        quirkElement.style.listStyleType = 'number'; // remove bullet points
        quirkElement.id = `quirk-${index}`;
        profileQuirksContainer.appendChild(quirkElement);
    });
    
}

function onLoginSuccess(user) {
    // update profile info
    updateProfileInfo(user);
    console.log('User logged in.');
}

function onLoginFailure() {
    console.log('User not logged in or login failed');

    // Redirect to login page
    window.location.replace("https://dylan-jacobs.github.io/swat-dates/");
}
