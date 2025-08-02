export class MatchRequest {
    constructor (userUID, displayName, email, traits) {
        this.userUID = userUID;
        this.displayName = displayName;
        this.email = email;
        this.traits = traits;
    }
}

export const MatchRequestConverter = { // to convert to firestore datatype
    toFirestore: (matchRequest) => ({
        userUID: matchRequest.userUID,
        displayName: matchRequest.displayName,
        email: matchRequest.email,
        traits: matchRequest.traits instanceof Map ? Object.fromEntries(matchRequest.traits) : matchRequest.traits
      }),
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      const traits = new Map(Object.entries(data.traits || {}));
      return new MatchRequest(data.userUID, data.displayName, data.email, traits);
    }
}