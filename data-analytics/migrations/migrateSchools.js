import dotenv from 'dotenv';
import { disconnectFromDatabase, getCollection } from '../db.js';
import fs from 'fs'

const schoolsJsonContent = fs.readFileSync('../data/schools.json', 'utf8');
const schoolsData = JSON.parse(schoolsJsonContent);

dotenv.config({ path: '../../.env' });

async function migrateData() {
    try {
        const collection = await getCollection('schools');
        await collection.drop().catch((error) => {
            if (error.codeName !== 'NamespaceNotFound') {
                throw error;
            }
        });

        await collection.createIndex({ zone: 1 });
        await collection.createIndex({ division: 1 });
        await collection.createIndex({ province: 1 });

        await collection.insertMany(schoolsData);
        console.log('Data migrated successfully!');
    } finally {
        await disconnectFromDatabase();
    }
}

migrateData();