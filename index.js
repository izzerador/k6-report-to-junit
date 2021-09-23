const builder = require('junit-report-builder');
const jp = require('jsonpath');
const fs = require('fs');

console.log('Parsing started....')

let file = JSON.parse(fs.readFileSync('result.json'));
let checks = jp.query(file, "$..checks");

let takeRAW = () => {
    for (let index = 0; index < checks.length; index++) {
        const element = checks[index];
        for (el in element) {
            const suite = builder.testSuite().name(el);
    
            setTestCaseData(suite, checks);
    
            builder.writeTo('report.xml');
            console.log('Report generated.');
        
            return;
        }
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

takeRAW();