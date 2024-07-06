import { MongoClient, ObjectId } from 'mongodb';

const dbName = process.env.DATABASE_NAME;
let mongoClient = null;

const getClient = async () => {
    try {
        if (mongoClient) return mongoClient;

        mongoClient = new MongoClient(process.env.MONGODB_URI, { minPoolSize: 1, maxPoolSize: 20 });
        await mongoClient.connect();
        return mongoClient;

    } catch (error) {
        console.error('Error connecting to the database:', error);

        throw error;
    }
};

const getCollection = async (name) => {
    return (await getClient()).db(dbName).collection(name);
};

const disconnectFromDatabase = async () => {
    if (mongoClient) {
        await mongoClient.close();
        console.log('Disconnected from the database');
    }
};

const findOne = async (collectionName, filter, options) => {
    return (await getCollection(collectionName)).findOne(filter, options);
};

const insertOne = async (collectionName, document) => {
    return (await getCollection(collectionName)).insertOne(document);
};

const updateOne = async (collectionName, filter, update) => {
    return (await getCollection(collectionName)).updateOne(filter, update);
};

const deleteOne = async (collectionName, filter) => {
    return (await getCollection(collectionName)).deleteOne(filter);
};

const findById = async (collectionName, id) => {
    return (await getCollection(collectionName)).findOne({ _id: new ObjectId(id) });
};

export {
    disconnectFromDatabase,
    getCollection,
    findOne,
    insertOne,
    updateOne,
    deleteOne,
    findById
}
