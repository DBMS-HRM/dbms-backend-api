import {QBuilder} from "./builder";


/**
 * Query Builder
 * @param table
 */
export function qb(table?: string) {
    return new QBuilder(table)
}

import {runQuery} from "./conn";


// async function main() {
//     const [error, res] = await runQuery(
//         qb('testData').where({userId: 3}),
//         {single: false, required: true}
//     )
//     console.log('ERROR', error)
//     console.log('RESULT', res)
// }
//
//
// main().then(console.log).catch(console.log)