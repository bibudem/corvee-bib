import fs from 'fs'
import path from 'path'

import { console } from '../../corvee/packages/core'

export async function savePageTitles(harvester, filter) {

    const today = new Date();
    const dir = path.join(__dirname, '..', 'data');
    const fileName = path.join(dir, `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}_page-titles.json`);
    const urlIdx = new Set();


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
        if (!urlIdx.has(data.url)) {
            urlIdx.add(data.url);
            doWrite(json(data));
        }
    }

    function doWrite(data) {
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
            console.warn('Could not stringify data, so removing responses array.');
            // console.warn(data);
            if ('request' in data) {
                delete data.request;

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
        return `${urlIdx.size === 1 ? `\n` : `,\n`}${str.replace(/(^)/gm, '$1  ')}`
    }


    harvester.setPlugins({
        name: 'save-page-info',
        onNavigationResponse: async (req, res, page) => {
            try {
                const title = page.title();
                const url = page.url();
                write({
                    url,
                    title
                })
            } catch (e) {
                console.error(e)
            }
        }
    })

    harvester.on('end', () => {
        try {
            stream.end('\n]');
            console.info(`${urlIdx.size} pages titles saved to ${fileName}.`)
        } catch (e) {
            console.todo(e)
        }
    })
}