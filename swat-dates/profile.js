import { listenForLoginChanges, signout, writeUser } from './firebase.js';
import { showPopup, hidePopup } from './helper_functions.js';


const traitTypeMapList = {
    'date idea': { id: 'dateIdeas', value: 'Date Ideas' },
    'joke': { id: 'jokes', value: 'Jokes' },
    'quirk': { id: 'quirks', value: 'Quirks' }
};

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
    for (const key in traitTypeMapList) {
        const traitID = traitTypeMapList[key].id;
        const traitLabel = traitTypeMapList[key].value;

        const container = document.getElementById(`${traitID}-container`);
        user[traitID].forEach((idea, index) => {
            const element = document.createElement('li');
            element.textContent = idea;
            element.className = 'trait-item';
            element.id = `${traitLabel}-${index}`;
            container.appendChild(element);
        });

        if (user[traitID].length === 0) {
            const emptyMessage = document.createElement('a');
            emptyMessage.textContent = `Holy lack of fun and banter :(`;
            container.appendChild(emptyMessage);
        }

        // add onclick event to edit button
        const editButton = document.getElementById(`${traitID}-edit-btn`);
        editButton.onclick = () => {
            createEditProfileTraitsPopup(user, traitTypeMapList[key]);
        };
    };
}

function createEditProfileTraitsPopup(user, traitTypeMap) {
    const traitID = traitTypeMap.id;
    const trait = traitTypeMap.value;

    const popup = document.getElementById('edit-profile-popup');
    const traitsContainer = document.getElementById('form-container');
    traitsContainer.innerHTML = ''; // clear existing traits
    popup.appendChild(traitsContainer);

    const title = document.createElement('h2');
    title.textContent = `Edit your ${trait.toString().toLowerCase()}:`;
    traitsContainer.appendChild(title);

    const form = document.createElement('form');
    form.id = 'edit-profile-form';
    traitsContainer.appendChild(form);

    user[traitID].forEach((item, index) => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = item;
        input.id = `${traitID}-${index}`;
        form.appendChild(input);
    });

    // Add a button to add new items
    const addButton = document.createElement('button');
    addButton.textContent = `Add new ${trait.slice(0, -1)}`;
    addButton.onclick = () => {
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.placeholder = `Enter a new ${trait.slice(0, -1)}`;
        newInput.id = `${traitID}-${user[traitID].length}`;
        form.appendChild(newInput);
        newInput.focus();
    };
    traitsContainer.appendChild(addButton);

    // Add save button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Changes';
    traitsContainer.appendChild(saveButton);
    saveButton.addEventListener('click', () => {
        // Collect updated traits
        user[traitID] = [];
        let index = 0;
        while (document.getElementById(`${traitID}-${index}`)) {
            const value = document.getElementById(`${traitID}-${index}`).value.toString().trim();
            if (value) user[traitID].push(value);
            index++;
        }
        
        // Update profile info
        // updateProfileInfo(user);
        writeUser(user)
            .then(() => {
                console.log('User traits updated successfully.');
                hidePopup('edit-profile-popup');
                window.location.reload(); // Reload the page to reflect changes
            })
            .catch((error) => {
                console.error('Error updating user traits:', error);
            });
    });

    const closeButton = document.createElement('button');   
    closeButton.className = 'close-button';
    closeButton.textContent = 'Close';
    closeButton.onclick = () => {
        hidePopup('edit-profile-popup');
    };
    traitsContainer.appendChild(closeButton);

    showPopup('edit-profile-popup');
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
