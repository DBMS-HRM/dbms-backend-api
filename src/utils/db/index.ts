import {QBuilder} from "./builder";
import {ErrorCode} from "./error";
import {runQuery, runTrx} from "./conn"
export {Error as MError} from "./error";

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
export {cleanQuery} from "./_util";

/**
 * Query Error Codes
 */
export const MErr = ErrorCode;