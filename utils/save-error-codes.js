import fs from 'fs'
import path from 'path'

import { console } from '../../corvee/packages/core/lib/logger';

export function saveErrorCodes(harvester, jobId) {
    const today = new Date();
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
                } else if (report && 'normalized' in report && 'code' in report.normalized) {
                    errorCode = report.normalized.code
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
        //fs.writeFileSync(path.join(__dirname, './error-codes.json'), JSON.stringify(Array.from(errorCodes), null, 2), 'utf8');
        //errorCodesStream.write(Array.from(errorCodes).join('\n'))
        errorCodesStream.end()
    })
}