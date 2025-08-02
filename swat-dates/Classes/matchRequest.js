export class MatchRequest {
    constructor (userUID, traits) {
        this.userUID = userUID;
        this.traits = traits;
    }
}

export const MatchRequestConverter = { // to convert to firestore datatype
    toFirestore: (matchRequest) => ({
        userUID: matchRequest.userUID,
        traits: matchRequest.traits instanceof Map ? Object.fromEntries(matchRequest.traits) : matchRequest.traits
      }),
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      const traits = new Map(Object.entries(data.traits || {}));
      return new MatchRequest(data.userUID, traits);
    }
}