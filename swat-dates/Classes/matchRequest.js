export class MatchRequest {
    constructor (user, traits) {
        this.user = user;
        this.traits = traits;
    }
}

export const MatchRequestConverter = { // to convert to firestore datatype
    toFirestore: (matchRequest) => ({
        user: matchRequest.user,
        traits: matchRequest.traits instanceof Map ? Object.fromEntries(matchRequest.traits) : matchRequest.traits
      }),
      fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new MatchRequest(data.user, data.traits);
      }
}