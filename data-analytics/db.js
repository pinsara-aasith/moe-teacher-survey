import { MongoClient, ObjectId } from 'mongodb';

const dbName = process.env.DATABASE_NAME;
let mongoClient = null;

const DB_SCHEMA = {
    collections: [
        {
            name: 'surveyRecords',
            indexes: [
                {
                    indexSpec: { nic: 1 },
                    options: { unique: true, name: 'nic' }
                }
            ]
        },
        {
            name: 'teachers',
            indexes: [
                {
                    indexSpec: { nic: 1 },
                    options: { unique: true, name: 'nic' }
                }
            ]
        },
        {
            name: 'school_admins',
            indexes: [
                {
                    indexSpec: { id: 1 },
                }
            ]
        },
        {
            name: 'schools',
            indexes: [
                { indexSpec: { zone: 1 } },
                { indexSpec: { division: 1 } },
                { indexSpec: { province: 1 } },
            ]
        }
    ]
}

const generateSchema = async (client) => {
    try {
        const db = client.db(dbName);

        for (const collectionSchema of DB_SCHEMA.collections) {
            const collectionName = collectionSchema.name;
            const existingCollections = await db.listCollections({ name: collectionName }).toArray();

            if (existingCollections.length !== 0) {
                continue;
            }

            await db.createCollection(collectionName);
            console.log(`Collection ${collectionName} created`);

            const collection = db.collection(collectionName);
            for (const index of collectionSchema.indexes) {
                await collection.createIndex(index.indexSpec, index.options);
                console.log(`Index ${index.options.name} created/synced for collection ${collectionName}.`);
            }
        }
    } catch (error) {
        console.error('Error creating database schema or indexes:', error);
    }
}

const getClient = async () => {
    try {
        if (mongoClient) return mongoClient;

        mongoClient = new MongoClient(process.env.MONGODB_URI, { minPoolSize: 1, maxPoolSize: 20 });
        await mongoClient.connect();
        await generateSchema(mongoClient);

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
    findById,
    generateSchema
}
