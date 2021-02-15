import {QBuilder} from "./builder";
import {ErrorCode} from "./error";
import {runQuery, runTrx} from "./conn";

/**
 * Query Builder
 * @param table
 * @param alias: short name for table
 */
export function qb(table?: string, alias?: string) {
    return new QBuilder(table, alias);
}

/**
 * Query Executors
 */
export {runQuery, runTrx} from "./conn";

/**
 * Query Error Codes
 */
export const MErr = ErrorCode;


// async function main() {
//     const [error, res] = await runQuery(
//         qb('testData').where({userId: 3}),
//         {single: false, required: true}
//     )
//     console.log('ERROR', error)
//     console.log('RESULT', res)
//
//     return qb("userData")
//         .join("userAccount", "userAccount.userId", "=", "td.userId")
//         .where({userId: 3}).query.query;
// }
//
//
// main().then(console.log).catch(console.log);