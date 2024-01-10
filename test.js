function prepMysql(arr) {
    let string = '';

    for (let i = 0; i < arr.length; i++) {
        let currentValues = Object.values(arr[i]);
        string += '(';

        for (let j = 0; j < currentValues.length; j++) {
            if (j === currentValues.length - 1) {
                string += `"${currentValues[j]}"), `;
            } else {
                string += `"${currentValues[j]}",`
            }
        }
    }

    let finalString = string.slice(0, string.length - 2);
    return finalString;

    // return string;
}


function returnNeededFields(arr) {
    const items = arr.map((x, y) => {
        let currentObject = {
            name: x.name,
            lastName: x.lastName,
        }

        return currentObject;
    });

    return items;
}
const testArr = [
    { name: 'bill', id: 1, lastName: "Adams" },
    { name: 'bill', id: 1, lastName: "Adams" },
    { name: 'bill', id: 1, lastName: "Adams" },
    { name: 'bill', id: 1, lastName: "Adams" }
];
console.log(prepMysql(testArr));

console.log(returnNeededFields(testArr));