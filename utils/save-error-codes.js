import fs from 'fs'
import { join } from 'path'

import { console, inspect } from '../../corvee/packages/core'

export function saveErrorCodes(harvester, jobId) {

    const dir = join(__dirname, '..', 'data');
    const fileName = join(dir, `${jobId}_error-codes.json`);

    const errorCodes = new Map();

    let i = 0;

    const errorCodesStream = fs.createWriteStream(fileName, {
        autoClose: false
    })

    harvester.on('record', function onRecord(record) {
        if ('reports' in record && Array.isArray(record.reports)) {
            record.reports.forEach(report => {
                let errorCode = null;
                let errorType;

                i++

                if ('code' in report) {
                    errorCode = report.code

                    if ('type' in report) {
                        errorType = report.type
                    }
                } else {
                    console.todo('This report has no code')
                    console.todo(inspect(record))
                    errorCode = '???'
                }

                if (!errorCodes.has(errorCode)) {
                    errorCodes.set(errorCode, {
                        errorCode,
                        errorType,
                        count: 0
                    })
                }
                errorCodes.get(errorCode).count++
            })
        }
    })

    harvester.on('end', () => {
        errorCodesStream.write(JSON.stringify([...errorCodes.values()].sort((a, b) => {
            const nameA = a.errorCode.toUpperCase(); // ignore upper and lowercase
            const nameB = b.errorCode.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        }), null, 2))

        console.info(`${errorCodes.size} error codes types saved to ${fileName}`)

        errorCodesStream.end()
    })
}