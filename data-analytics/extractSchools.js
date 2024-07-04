import xlsx from 'xlsx';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { writeFileSync } from 'fs';

const inputExcelFile = './data/School_Level_User_Names_Passwords.xlsx';
const outputCsvFile = './data/schools.csv';
const outputJSONFile = './data/schools.json';


const workbook = xlsx.readFile(inputExcelFile);
const worksheet = workbook.Sheets['List 2024'];
const data = xlsx.utils.sheet_to_json(worksheet);

const schools = [];

(async () => {
  let i = 1;

  for (const row of data) {
    if (row['School Census No (User Name)'] && row['Password']) {
      console.log(`${i}/${data.length} => Adding school : ${row['School Name 2023']}`)

      schools.push({
        code: row['School Name with School Census No'].split('-').map(s => s.trim())[0],
        name: row['School Name with School Census No'],
        province: row['Province 2023'].split('.').map(s => s.trim())[1],
        zone: row['Zone 2023'].trim(),
        division: row['Edu Division 2021'].trim(),
      });
      i++;
    }
  }

  const csvWriter = createCsvWriter({
    path: outputCsvFile,
    header: [
      { id: 'code', title: 'code' },
      { id: 'name', title: 'name' },
      { id: 'province', title: 'province' },
      { id: 'zone', title: 'zone' },
      { id: 'division', title: 'division' },
    ],
  });

  await csvWriter.writeRecords(schools);
  console.log(JSON.stringify(schools, null, 2));

  writeFileSync(outputJSONFile, JSON.stringify(schools, null, 2));
})()