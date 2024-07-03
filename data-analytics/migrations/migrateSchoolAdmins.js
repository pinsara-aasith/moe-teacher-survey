import dotenv from 'dotenv';
import { disconnectFromDatabase, findOne, getCollection } from '../db.js';
import fs from 'fs'
const schoolAdminsJsonContent = fs.readFileSync('../data/school_admins.json', 'utf8');
const schoolAdminsData = JSON.parse(schoolAdminsJsonContent);

const schoolsJsonContent = fs.readFileSync('../data/schools.json', 'utf8');
const schoolsData = JSON.parse(schoolsJsonContent);

dotenv.config({ path: '../../.env' });

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

        await usersCollection.createIndex({ email: 1 });
        await usersCollection.createIndex({ schoolCode: 1 });
        await usersCollection.createIndex({ refreshToken: 1 });

        await Promise.all(schoolAdminsData.map(sA => ({
            email: null,
            schoolCode: sA.schoolCode,
            password: sA.password,
            name: schoolsData.find(s => s.code == sA.schoolCode)?.name,
            role: 'school-admin',
            refreshToken: null,
        })).map(async (sA) => {
            await usersCollection.replaceOne({ schoolCode: sA.schoolCode }, { ...sA }, { upsert: true })
        }));

        console.log('Data migrated successfully!');
    } finally {
        await disconnectFromDatabase();
    }
}

migrateData();