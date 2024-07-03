import dotenv from 'dotenv';
import { disconnectFromDatabase, findOne, getCollection } from '../db.js';
import fs from 'fs'
import { hash } from 'bcrypt';
const systemAdminsJsonContent = fs.readFileSync('../data/system_admins.json', 'utf8');
const systemAdminsData = JSON.parse(systemAdminsJsonContent);

dotenv.config({ path: '../../.env' });

async function migrateData() {
    try {
        const usersCollection = await getCollection('users');
        if (!(await findOne('users', { _id: { "$ne": null } }))) {
            await usersCollection.drop().catch((error) => {
                if (error.codeName !== 'NamespaceNotFound') {
                    throw error;
                }
            });

            await usersCollection.createIndex({ email: 1 });
            await usersCollection.createIndex({ schoolCode: 1 });
            await usersCollection.createIndex({ refreshToken: 1 });
        }

        await Promise.all(systemAdminsData.map(sA => ({
            email: sA.email,
            schoolCode: null,
            password: hash(sA.password, 10),
            name: sA.name,
            role: 'system-admin',
            refreshToken: null,
        })).map(async (sA) => {
            await usersCollection.replaceOne({ email: sA.email }, { ...sA }, { upsert: true })
        }));

        console.log('Data migrated successfully!');
    } finally {
        await disconnectFromDatabase();
    }
}

migrateData();