import fs from 'fs'
import path from 'path'

export async function toSql({
    jobId = '2019-12-01',
    projectId = 'site-web',
    dir,
    data
}) {

    // const jobId = prefix.replace(/-/g, '');

    const outFilePath = path.join(dir, `site-web-${jobId}.sql`);
    const prologue = `
/*
 * Insertion des données dans la table liens 
 */

DELETE FROM corvee.dbo.liens WHERE projectId = 'site-web' AND jobId = '${jobId}';
`;
    const sqlColumns = [
        // 'lienId',
        'url',
        'libelle',
        'page',
        'statut',
        'message',
        'realurl',
        'externe',
        'action',
        'projectId',
        'error_code',
        'jobId',
        'context'
    ];
    const sqlPrologue = `INSERT into liens (${sqlColumns.join(", ")}) VALUES(`;
    const sqlEpilogue = `);`;

    const sqlQuery = [prologue];

    function sql(data) {
        return `${sqlPrologue}'${sqlColumns.map(key => {
            const sqlFrag = typeof data[key] === "string" ? data[key].replace(/'/g, "''") : data[key];
            return sqlFrag;
        }).join("', '")}'${sqlEpilogue}`;
    }

    function msgFor(reports) {
        return reports
            // .filter(report => report.level !== 'info')
            .map(report => `<li data-error-code="${report.code}">${'message' in report ? report.message : report.code}</li>`)
            .join('');
    }

    function errCodesFor(reports) {
        return reports
            // .filter(report => report.level !== 'info')
            .map(report => report.code)
            .join(', ')
    }

    data.forEach(
        ({
            id: lienId,
            urlData: url,
            text: libelle,
            finalUrl,
            parent: page,
            browsingContextStack,
            extern,
            reports,
            httpStatusCode,
            httpStatusText
        } = {
            ...item
        }) => {
            const errCode = `http-${httpStatusCode}`;
            const sqlData = {
                lienId,
                url,
                libelle,
                page,
                context: browsingContextStack ? browsingContextStack.flat(Infinity)[0] : '',
                statut: "error",
                message: msgFor(reports),
                realurl: finalUrl ? finalUrl : "",
                externe: extern ? "1" : "0",
                action: "to-be-fixed",
                error_code: errCodesFor(reports),
                projectId,
                jobId
            };

            sqlQuery.push(sql(sqlData));
        }
    );

    fs.writeFileSync(outFilePath, sqlQuery.join('\n'));
}