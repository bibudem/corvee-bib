import fs from 'fs'
import path from 'path'

import { console } from '../../corvee/packages/core/lib/logger'

export function saveBrowsingContexts(harvester, jobId) {
    const dir = path.join(__dirname, '..', 'data');
    const fileName = path.join(dir, `${jobId}_browsing-contexts.json`);

    harvester.on('browsing-contexts', function onBrowsingContexts(data) {

        fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf8');

    })
}