const builder = require('junit-report-builder');
const jp = require('jsonpath');
const fs = require('fs');

console.log('Parsing started....')

const file = JSON.parse(fs.readFileSync(process.env.REPORT ? process.env.REPORT : 'result.json'));
let data = file.root_group.groups;

let takeSuitesFromSubgroups = () => {
    for (el in data) {
        // Main group
        let mainGroup = data[el];
    
        console.log('tests count - '+ Object.keys(mainGroup.groups).length);
    
        for (let index = 0; index < Object.keys(mainGroup.groups).length; index++) {
            // take the subgroup key (for suite)
            let suiteName = Object.keys(mainGroup.groups)[index] ? Object.keys(mainGroup.groups)[index] : el;
            // we need only checks objects from subgroups
            let checks = jp.query(mainGroup.groups[suiteName], "$..checks");
    
            const suite = builder.testSuite().name(suiteName);
            setTestCaseData(suite, checks)
        }

        builder.writeTo('report.xml');
        console.log('Report generated.');
    
        return;
    }
}

let takeRAW = () => {
    for (el in data) {
        let checks = jp.query(data[el], "$..checks");
        const suite = builder.testSuite().name(el);

        setTestCaseData(suite, checks);

        builder.writeTo('report.xml');
        console.log('Report generated.');
    
        return;
    }
}

let setTestCaseData = (suite, checks) => {
    for (let i = 0; i < checks.length; i++) {
        const check = checks[i];
        
        // take the key (test description as test name)
        for (info in check) {
            let className = check[info].path
            let testName = check[info].name
            if (check[info].fails && testName) {
                suite.testCase().className(className).name(testName).failure();

                console.log(`${testName} failed`);

                continue;
            }

            if (!testName) {
                console.error("check k6 report, testName doesnt exist")

                continue;
            }

            suite.testCase().className(className).name(testName)
        }

    }
}

if (process.env.RAW) {
    console.log('RAW data taking...');

    takeRAW();
    return;
}

takeSuitesFromSubgroups();

// or build empty report
builder.testSuite().name('test');
builder.writeTo('report.xml');
console.log('Report generated.');