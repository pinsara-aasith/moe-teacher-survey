import { readFile, utils } from 'xlsx';
import { hash } from 'bcrypt';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { writeFileSync } from 'fs';

const inputExcelFile = './data/School_Level_User_Names_Passwords.xlsx';
const outputCsvFile = './data/school_admins.csv';
const outputJSONFile = './data/school_admins.json';
const saltRounds = 10;

const workbook = readFile(inputExcelFile);
const worksheet = workbook.Sheets['List 2024'];
const data = utils.sheet_to_json(worksheet);

const admins = [];

(async () => {
  let i = 1;

  for (const row of data) {
    if (row['School Census No (User Name)'] && row['Password']) {
      console.log(`${i}/${data.length} => Adding school : ${row['School Name 2023']}`)

      const hashedPassword = await hash(row['Password'], saltRounds);
      admins.push({
        id: row['School Census No (User Name)'],
        schoolCode: row['School Census No (User Name)'],
        password: hashedPassword
      });
      i++;
    }
  }

  const csvWriter = createCsvWriter({
    path: outputCsvFile,
    header: [
      { id: 'id', title: 'Id' },
      { id: 'schoolCode', title: 'School' },
      { id: 'password', title: 'Password' },
    ],
  });

  await csvWriter.writeRecords(admins);
  console.log(JSON.stringify(admins, null, 2));

  writeFileSync(outputJSONFile, JSON.stringify(admins, null, 2));
})()