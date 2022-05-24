import fs from 'fs'
import { join, resolve } from 'path'
import yargs from 'yargs'

import { toRecord } from '../../corvee/packages/processor'

export async function toJsonl({
    jobId = '2019-12-01',
    projectId = 'site-web',
    dir = process.cwd(),
    data
} = {}) {

    // const jobId = prefix.replace(/-/g, '');

    const outFilePath = join(dir, `site-web-${jobId}_jsonl.json`);

    function jsonl(data) {
        return `${JSON.stringify(data)}\n`;
    }

    const records = await toRecord({ jobId, data });

    data = records.map(jsonl).join('');

    fs.writeFileSync(outFilePath, data);
}

if (require.main === module) {

    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');
    const day = `${today.getDate()}`.padStart(2, '0');

    const defaultTodayDashedPrefix = `${year}-${month}-${day}`;

    const argv = yargs
        .options({
            j: {
                alias: 'job',
                default: defaultTodayDashedPrefix,
                describe: `Job id. Defaults to today\'s date.`,
                type: 'string'
            },
            r: {
                alias: 'resume',
                default: false,
                type: 'boolean',
                describe: 'Resumes a previously stoped job. Requires --job options.',
                implies: 'j'
            }
        })
        .help()
        .argv;


    toJsonl({
        jobId: argv.j,
        dir: process.cwd()
    });
}