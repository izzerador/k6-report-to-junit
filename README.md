# k6-report-to-junit
## Sergey Ryzhkov | @kolesagroup | https://t.me/izzerador

k6 json report parser

## Installation

Requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd k6-report-to-junit
npm i
```

## Before Run
Prepare tests format like this:
```
import { group } from 'k6';

export default function () {
    group('Root Group', function () {
        group('Suite', function () {
            group('test', function () {
                check(response, {
                    'is flood': (r) => JSON.parse(r.body).data === false,
                    'penaltyScore is 0': (r) => JSON.parse(r.body).data. === 0,
                });
            });
        });
    });
}

```

### OR you can run script with RAW variable
```
RAW=true node index.js
```

## Run

Move k6 json report into directory and name it result.json

OR use env variable REPORT='filename.json' node index.js#

Run script
```
node index.js
```
