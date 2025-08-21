export class User {
    constructor(userUID, displayName, email, photoURL, dateIdeas, jokes, quirks) {
        this.userUID = userUID;
        this.displayName = displayName;
        this.email = email;
        this.photoURL = photoURL;
        this.dateIdeas = dateIdeas || [];
        this.jokes = jokes || [];
        this.quirks = quirks || []; 
    }
}

export const UserConverter = { // to convert to firestore datatype
    toFirestore: (user) => ({
        userUID: user.userUID,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        dateIdeas: user.dateIdeas || [],
        jokes: user.jokes || [],
        quirks: user.quirks || [] // ensure quirks is always an array
        }),
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.userUID, data.displayName, data.email, data.photoURL, data.dateIdeas, data.jokes, data.quirks);
    }
}