import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { console } from 'corvee-core'

export function saveBrowsingContexts(harvester, jobId) {
    const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
    const fileName = join(dir, `${jobId}_browsing-contexts.json`);

    harvester.on('browsing-contexts', function onBrowsingContexts(data) {

        writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf8');

    })
}