import { readFileSync, openSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export async function toCsv({
    jobId = '2020-02-10',
    dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data'),
    data
} = {}) {

    // const jobId = prefix.replace(/-/g, '');

    const eol = '\n';
    const inFilePath = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', `${jobId}_harvested.json`);
    console.log('reading data from ' + inFilePath);
    const dataStr = readFileSync(inFilePath);
    const dataObj = JSON.parse(dataStr);

    const outFilePath = path.join(dir, `${jobId}_harvested.csv`);
    const outFile = openSync(outFilePath, 'w');
    const headers = [...dataObj.reduce((keys, item) => {
        Object.keys(item).forEach(key => {
            if (!key.startsWith('_')) {
                keys.add(key);
            }
        });
        return keys;
    }, new Set())];

    console.log('headers: ' + headers.join(', '))

    // outFile.on('open', () => {
    //     outFile.write(`"${headers.join('","')}"`);
    //     write(dataObj);
    // })

    function csvItemToString(str = '') {
        if (str === null) {
            str = '';
        }
        return `"${('' + str).replace('\n', ' ').replace('"', '""')}"`
    }

    function arrayPropsToString(arr) {
        return `${arr.map(item => csvItemToString(item)).join(',')}${eol}`;
    }

    function write(dataObj) {
        dataObj.forEach(item => {

            const dataObjItem = [];

            headers.forEach(key => {
                // let value = '';
                // if (key in item) {
                //     value = csvItemToString(item[key]);
                // }
                dataObjItem.push(item[key]);
            })

            fs.writeSync(outFile, arrayPropsToString(dataObjItem));

        });
    }

    fs.writeSync(outFile, `"${headers.join('","')}"${eol}`);
    write(dataObj)
}

toCsv()