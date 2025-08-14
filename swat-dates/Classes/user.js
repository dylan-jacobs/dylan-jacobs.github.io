export class User {
    constructor(userUID, displayName, email, photoURL, dateIdeas, joke) {
        this.userUID = userUID;
        this.displayName = displayName;
        this.email = email;
        this.photoURL = photoURL;
        this.dateIdeas = dateIdeas;
        this.joke = joke;
    }

}

export const UserConverter = { // to convert to firestore datatype
    toFirestore: (user) => ({
        userUID: user.userUID,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        dateIdeas: user.dateIdeas,
        joke: user.joke
        }),
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.userUID, data.displayName, data.email, data.photoURL, data.dateIdeas, data.joke);
    }
}