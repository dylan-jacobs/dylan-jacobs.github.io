export class MatchRequest {
    constructor (userUID, displayName, email, traits, dateIdeas, joke) {
        this.userUID = userUID;
        this.displayName = displayName;
        this.email = email;
        this.traits = traits;
        this.dateIdeas = dateIdeas;
        this.joke = joke;
    }
}

export const MatchRequestConverter = { // to convert to firestore datatype
    toFirestore: (matchRequest) => ({
        userUID: matchRequest.userUID,
        displayName: matchRequest.displayName,
        email: matchRequest.email,
        traits: matchRequest.traits instanceof Map ? Object.fromEntries(matchRequest.traits) : matchRequest.traits,
        dateIdeas: matchRequest.dateIdeas,
        joke: matchRequest.joke
      }),
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      const traits = new Map(Object.entries(data.traits || {}));
      return new MatchRequest(data.userUID, data.displayName, data.email, traits, data.dateIdeas, data.joke);
    }
}