import { createWriteStream } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { console } from 'corvee-core'

export async function saveInternLinks(harvester, jobId, filter) {

    const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
    const fileName = join(dir, `${jobId}_internLinks.json`);
    const urlIdx = new Set();


    let stream;
    try {
        stream = createWriteStream(fileName, {
            flags: 'w'
        })
    } catch (e) {
        console.error(e)
        process.exit()
    }

    function write(data) {
        data = `${urlIdx.size === 1 ? `\n\t` : `,\n\t`}${JSON.stringify(data)}`;
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

    harvester.on('record', function onRecord(record) {
        if (filter && !filter(record)) {
            return
        }

        if ('finalUrl' in record && typeof record.finalUrl === 'string' && record.finalUrl.startsWith('https://bib.umontreal.ca')) {
            if (!urlIdx.has(record.finalUrl)) {
                urlIdx.add(record.finalUrl);
                write(record.finalUrl);
            }
        }

    })

    harvester.on('end', () => {
        try {
            stream.end('\n]');
            console.info(`${urlIdx.size} intern links saved to ${fileName}.`)
        } catch (e) {
            console.todo(e)
        }
    })
}