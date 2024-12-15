// function prepMysql(arr) {
//     let string = '';

//     for (let i = 0; i < arr.length; i++) {
//         let currentValues = Object.values(arr[i]);
//         string += '(';

//         for (let j = 0; j < currentValues.length; j++) {
//             if (j === currentValues.length - 1) {
//                 string += `"${currentValues[j]}"), `;
//             } else {
//                 string += `"${currentValues[j]}",`
//             }
//         }
//     }

//     let finalString = string.slice(0, string.length - 2);
//     return finalString;

//     // return string;
// }


// function returnNeededFields(arr) {
//     const items = arr.map((x, y) => {
//         let currentObject = {
//             name: x.name,
//             lastName: x.lastName,
//         }

//         return currentObject;
//     });

//     return items;
// }
// const testArr = [
//     { name: 'bill', id: 1, lastName: "Adams" },
//     { name: 'bill', id: 1, lastName: "Adams" },
//     { name: 'bill', id: 1, lastName: "Adams" },
//     { name: 'bill', id: 1, lastName: "Adams" }
// ];
// console.log(prepMysql(testArr));

// console.log(returnNeededFields(testArr));


function formatMysqlDate(string) {
    const arrayOfString = string.split('-');

    const month = arrayOfString[1];
    const year = arrayOfString[0];
    const day = arrayOfString[2].split('').slice(0, 2).join('');

    const finalString = `${month}/${day}/${year}`;

    return finalString;
}

// console.log(formatMysqlDate('2024-04-16T12:14:56.000Z'));



const testData = [
    { name: 'bill', id: 1, lastName: "Adams" },
    { name: 'Ben', id: 1, lastName: "Adams" },
    { name: 'Adam', id: 1, lastName: "Adams" },
    { name: 'Henry', id: 1, lastName: "Adams" }
];


function createCSV(obj) {
    const arrayOfData = obj.map((x) => {
        let csv = '';
        for (const value of Object.values(x)) {
            csv += `"${value}",`;
        }
        return csv + '\r\n';
    });

    const csvString = arrayOfData.join('');
    return csvString;
}

console.log(createCSV(testData));