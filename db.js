import { MongoClient } from "mongodb";

const sessions = {};

MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        const db = client.db(process.env.DB_NAME);
        sessions[process.env.DB_NAME] = db;
    })
    .catch(err => console.error("Error connecting to MongoDB", err));

export { sessions };