const fs = require('fs');

function decodeValue(value, base) {
    return parseInt(value, base);
}

function lagrangeInterpolation(xVals, yVals, k) {
    function basisPolynomial(i) {
        let num = 1;
        let denom = 1;
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                num *= 0 - xVals[j]; 
                denom *= xVals[i] - xVals[j];
            }
        }
        return num / denom;
    }

    let constantTerm = 0;
    for (let i = 0; i < k; i++) {
        constantTerm += yVals[i] * basisPolynomial(i);
    }

    return constantTerm;
}


function findSecretFromJson(jsonInput) {
    let data = JSON.parse(jsonInput);

    let n = data["keys"]["n"];
    let k = data["keys"]["k"];

   
    let xVals = [];
    let yVals = [];

    for (let i = 1; i <= n; i++) {
        if (data[i.toString()]) {
            let base = parseInt(data[i.toString()]["base"]);
            let value = data[i.toString()]["value"];
            xVals.push(i);  
            yVals.push(decodeValue(value, base));  
        }
    }

    let secret = lagrangeInterpolation(xVals, yVals, k);

    return Math.round(secret);  
}

function readJsonAndFindSecretSync(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        const secret = findSecretFromJson(data);
        console.log(`Secret for ${filename}: ${secret}`);
    } catch (err) {
        console.error(`Error reading file ${filename}:`, err);
    }
}

function processTestCases() {
    console.log("Processing Test Case 1:");
    readJsonAndFindSecretSync('testcase1.json');  

    console.log("Processing Test Case 2:");
    readJsonAndFindSecretSync('testcase2.json');  
}

processTestCases();