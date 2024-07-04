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

        await Promise.all(schoolAdminsData.map(async (sA) => {
            console.log(`Adding admin for school ${sA.schoolCode}`)
            let school = await findOne('schools', { code: sA.schoolCode })
            
            if (!school) {
                console.error(`School not found:  ${sA.schoolCode}`)
                return;
            }
            let data = {
                email: null,
                school: school._id,
                password: sA.password,
                name: schoolsData.find(s => s.code == sA.schoolCode)?.name,
                role: 'school-admin',
                refreshToken: null,
            }

            await usersCollection.replaceOne({ data }, { ...sA, }, { upsert: true })
        }));

        console.log('Data migrated successfully!');
    } finally {
        await disconnectFromDatabase();
    }
}

migrateData();