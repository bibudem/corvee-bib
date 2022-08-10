import fs from 'fs'
import path from 'path'

import { console } from '../../corvee/packages/core'

export async function saveRecords(harvester, jobId, filter) {

    const dir = path.join(__dirname, '..', 'data');
    const fileName = path.join(dir, `${jobId}_harvested.json`);
    var i = 1;
    let stream;
    try {
        stream = fs.createWriteStream(fileName, {
            flags: 'w'
        })
    } catch (e) {
        console.error(e)
        process.exit()
    }

    function write(data) {
        if (stream.pending) {
            process.nextTick(() => {
                write(data);
            })
        } else {
            stream.write(data);
        }
    }

    stream.once('open', () => {
        stream.write('[')
    })

    function json(data) {
        let str = '';
        try {
            str = JSON.stringify(data, null, 2);
        } catch (e) {

            console.warn(`Could not stringify data, so removing responses array. Data: ${data}`);

            if ('request' in data) {
                data.request = '[request]'

                try {
                    str = JSON.stringify(data, null, 2);
                } catch (e) {
                    console.warn('Could not stringify data with `responseChain` removed.')
                    console.warn(e)
                    str = JSON.stringify({
                        id: data.id,
                        url: data.url
                    }, null, 2)
                }
            }
        }
        return `${i === 1 ? `\n` : `,\n`}${str.replace(/(^)/gm, '$1  ')}`
    }

    harvester.on('record', function onRecord(record) {
        if (filter && !filter(record)) {
            return
        }

        write(json(record))

        console.info(`[record] ${i++}`)

    })

    harvester.on('end', () => {
        console.info('harvester on end...')
        try {
            stream.end('\n]');
        } catch (e) {
            console.todo(e)
        }
    })
}