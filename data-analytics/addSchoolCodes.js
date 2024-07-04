import { readFileSync, writeFileSync } from 'fs';

const fileContent = readFileSync('School_Level_User_Names_Passwords', 'utf8');

const jsonArray = JSON.parse(fileContent);

const data = [];

// Loop through each item in the JSON array
jsonArray.forEach(item => {
    // Split the item by '-' to extract code and name
    const parts = item.split(' - ');
    if (parts.length === 2) {
        const code = parts[0].trim();
        const name = parts[1].trim();
        // Create a JSON object with code and name and push it to the data array
        data.push({ code, name });
    }
});


const fileContent2 = readFileSync('govt_school_names (4).json', 'utf8');
const jsonArray2 = JSON.parse(fileContent2);

const data2 = [];
const data3 = [];
jsonArray2.forEach(item => {
    // Split the item by '-' to extract code and name
    let r = data.find(d => d.name.toUpperCase().trim() === item.name.toUpperCase().trim())
    if (!r) {
        data3.push(item)
        return;
    };

    item.name = r.code + " - " + item.name

    data3.push({code: r.code.trim(), ...item})
});



console.log(JSON.stringify(data3, null, 2));

console.log(JSON.stringify(data2, null, 2));
console.log(data3.length, data.length);

writeFileSync('./data/schools.json', JSON.stringify(data3, null, 2));
