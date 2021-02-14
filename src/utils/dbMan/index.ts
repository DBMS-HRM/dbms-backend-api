import {QBuilder} from "./builder";

/**
 * Query Builder
 * @param table
 */
export function qb(table: string) {
    return new QBuilder(table)
}

import {runQuery} from "./conn";


async function main() {
    const query = qb('testData').insert({userId: 2, fullName: 'Test User'}).done()
    const [error, res] = await runQuery(query)
    console.log('ERROR', error)
    console.log('RESULT', res)
}


main().then(console.log).catch(console.log)