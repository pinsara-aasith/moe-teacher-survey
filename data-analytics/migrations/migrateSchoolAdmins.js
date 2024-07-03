import dotenv from 'dotenv';
import { disconnectFromDatabase, getCollection } from '../db.js';
import fs from 'fs'
const schoolAdminsJsonContent = fs.readFileSync('../data/school_admins.json', 'utf8');
const schoolAdminsData = JSON.parse(schoolAdminsJsonContent);

dotenv.config({ path: '../../edu-api/.env' });

async function migrateData() {
    try {
        const collection = await getCollection('school_admins');
        await collection.drop().catch((error) => {
            if (error.codeName !== 'NamespaceNotFound') {
                throw error;
            }
        });

        await collection.createIndex({ id: 1 });
        await collection.insertMany(schoolAdminsData);
        console.log('Data migrated successfully!');
    } finally {
        await disconnectFromDatabase();
    }
}

migrateData();