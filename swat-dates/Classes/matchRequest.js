export class MatchRequest {
    constructor (userUID, traits, drugTraits, sexTraits) {
        this.userUID = userUID;
        this.traits = traits;
        this.drugTraits = drugTraits;
        this.sexTraits = sexTraits;
    }
}

export const MatchRequestConverter = { // to convert to firestore datatype
    toFirestore: (matchRequest) => ({
        userUID: matchRequest.userUID,
        traits: matchRequest.traits instanceof Map ? Object.fromEntries(matchRequest.traits) : matchRequest.traits,
        drugTraits: matchRequest.drugTraits instanceof Map ? Object.fromEntries(matchRequest.drugTraits) : matchRequest.drugTraits,
        sexTraits: matchRequest.sexTraits instanceof Map ? Object.fromEntries(matchRequest.sexTraits) : matchRequest.sexTraits
      }),
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      const userUID = data.userUID;
      const traits = new Map(Object.entries(data.traits || {}));
      const drugTraits = new Map(Object.entries(data.drugTraits || {}));
      const sexTraits = new Map(Object.entries(data.sexTraits || {}));
      return new MatchRequest(userUID, traits, drugTraits, sexTraits);
    }
}