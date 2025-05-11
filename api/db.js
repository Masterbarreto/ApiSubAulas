import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export async function getDb() {
    if (!client.isConnected?.()) {
        await client.connect();
    }
    return client.db(process.env.DB_NAME);
}