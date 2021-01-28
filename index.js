const builder = require('junit-report-builder');
const jp = require('jsonpath');
const fs = require('fs');

let file = JSON.parse(fs.readFileSync('result.json'));
let data = jp.query(file, "$..checks");

data = data.filter(el => {
    return Object.keys(el).length > 0; 
});

data.splice(0, 1) // first object is empty

const suite = builder.testSuite().name('test');

for (let i = 0; i < data.length; i++) { 
    for (info in data[i]) {
        let className = data[i][info].path ? data[i][info].path : 'Test Name Not Found';
        let testName = data[i][info].name ? data[i][info].name : 'Check name not found';
        if(data[i][info].fails && data[i][info].name) {
            suite.testCase().className(className).name(testName).failure();

            continue;
        }

        suite.testCase().className(className).name(testName)       
    }
  }

builder.writeTo('report.xml');