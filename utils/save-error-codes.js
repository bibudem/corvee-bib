import fs from 'fs'
import path from 'path'

import { console } from '../../corvee/packages/core';

export function saveErrorCodes(harvester, jobId) {

    const dir = path.join(__dirname, '..', 'data');
    const fileName = path.join(dir, `${jobId}_error-codes.json`);

    const errorCodes = new Set();

    const errorCodesStream = fs.createWriteStream(fileName, {
        autoClose: false
    })

    harvester.on('record', function onRecord(record) {
        if ('reports' in record && Array.isArray(record.reports)) {
            record.reports.forEach(report => {
                let errorCode = null;

                if ('code' in report) {
                    errorCode = report.code
                } else {
                    console.todo('This report has no code')
                    console.todo(report)
                    errorCode = '???'
                }

                if (!errorCodes.has(errorCode)) {
                    errorCodes.add(errorCode)
                    errorCodesStream.write(errorCode + '\n')
                }
            })
        }
    })

    harvester.on('end', () => {
        errorCodesStream.end()
    })
}