const db = "SwatDebates";
const debatesCollection = "debates";

export function initMongoDB() {
    const { MongoClient, ServerApiVersion } = require('mongodb');

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
    });

    return client;
}

export async function insertDebate(client, debate) {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const db = client.db(db);
        const collection = db.collection(debatesCollection);
        const result = await collection.insertOne({ user: debate.user, debateTitle: debate.title, description: debate.description, location: debate.location, time: debate.time, topic: debate.topic, host: debate.host});
        console.log('Inserted ID: ', result.insertedId);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

export async function findDebate(client, debate) {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const db = client.db("SwatDebates");
        const collection = db.collection("debates");

        const result = await collection.findOne({ user: debate.user, title: debate.title });
        console.log('Inserted ID: ', result.insertedId);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }

    return result;
}

export async function findAllDebates(client) {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const db = client.db(db);
        const collection = db.collection(debatesCollection);

        const result = await collection.find({}).toArray();
        console.log('All debates: ', result);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }

    return result;
}

export async function deleteDebate(client, debate) {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const db = client.db(db);
        const collection = db.collection(debatesCollection);

        const result = await collection.deleteOne({ user: debate.user, debateTitle: debate.title });
        console.log('Deleted count: ', result.deletedCount);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
