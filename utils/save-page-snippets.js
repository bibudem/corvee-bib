import { createWriteStream, WriteStream } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { console } from 'corvee-core'

/**
 * @param {import("corvee-harvester").Harvester} harvester
 * @param {string} job
 */
export async function savePageSnippets(harvester, job) {

    const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
    const fileName = join(dir, `${job}_page-snippets.json`);
    var i = 1;

    /**
     * @type WriteStream
     */
    let stream;

    try {
        stream = createWriteStream(fileName, {
            flags: 'w'
        })
    } catch (e) {
        console.error(e)
        process.exit()
    }

    /**
     * @param {string} data
     */
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

    /**
     * @param { Object<string, *> } data
     */
    function json(data) {
        const str = JSON.stringify(data, null, 2);
        return `${i === 1 ? `\n` : `,\n`}${str.replace(/(^)/gm, '$1  ')}`
    }

    harvester.on('page-snippet', function onPageSnippet(data) {
        write(json(data))
        i++
    })

    harvester.on('end', () => {
        const closingBracket = i === 1 ? ']' : '\n]'
        try {
            stream.end(closingBracket);
        } catch (e) {
            console.todo(e)
        }
    })
}