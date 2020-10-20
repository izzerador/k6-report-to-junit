const builder = require('junit-report-builder');
const jp = require('jsonpath');
const fs = require('fs');

let file = JSON.parse(fs.readFileSync('result.json'));
let data = jp.query(file, "$..checks");

data = data.filter(el => {
    return Object.keys(el).length > 0; 
});

data.splice(0, 1) // in first object has no test case info

const suite = builder.testSuite().name('test');

for (let i = 0; i < data.length; i++) { 
    for (info in data[i]) {
        if(data[i][info].fails && data[i][info].name) {
            suite.testCase().className(data[i][info].path).name(data[i][info].name).failure();

            continue;
        }

        suite.testCase().className(data[i][info].path).name(data[i][info].name)       
    }
  }

builder.writeTo('report.xml');