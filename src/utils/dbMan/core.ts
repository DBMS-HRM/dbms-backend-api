

/**
 ░█▀▀▄ █▀▀█ ▀▀█▀▀ █▀▀█ 　 ▀▀█▀▀ █──█ █▀▀█ █▀▀ █▀▀
 ░█─░█ █▄▄█ ──█── █▄▄█ 　 ─░█── █▄▄█ █──█ █▀▀ ▀▀█
 ░█▄▄▀ ▀──▀ ──▀── ▀──▀ 　 ─░█── ▄▄▄█ █▀▀▀ ▀▀▀ ▀▀▀
 */

/**
 *  Primary data types
 */
export enum QBJobType {
    SELECT,
    INSERT,
    UPDATE,
    DELETE,
    RAW,
}

/**
 * Data input to query builder
 */
export interface QBDataType {
  [key: string]: any;
}

/**
 * QB Job Data
 */
export interface QBJob {
  type: QBJobType;
  table: string;
}

/**
 * QB Job Data for SELECT Query
 */
export interface QBJob_SELECT extends QBJob{
  selection?: string[];
  where?: QBDataType;
}

/**
 * QB Job Data for INSERT Query
 */
export interface QBJob_INSERT extends QBJob{
    insert: QBDataType;
}

/**
 * QB Job Data for UPDATE Query
 */
export interface QBJob_UPDATE extends QBJob{
    update: QBDataType;
    where?: QBDataType;
}

/**
 * QB Job Data for UPDATE Query
 */
export interface QBJob_RAW extends QBJob{
    raw: string;
    args: string;
    mapping: boolean
}

/**
 ░█▀▀█ █──█ ─▀─ █── █▀▀▄ █▀▀ █▀▀█ █▀▀
 ░█▀▀▄ █──█ ▀█▀ █── █──█ █▀▀ █▄▄▀ ▀▀█
 ░█▄▄█ ─▀▀▀ ▀▀▀ ▀▀▀ ▀▀▀─ ▀▀▀ ▀─▀▀ ▀▀▀
 */

import {toSnakeCase} from "./typo";


/**
 * Build SELECT query
 * can be executed on pg postgres client
 * @param jobData
 */
export function qb_SELECT(jobData: QBJob_SELECT): {query: string, args: string[]}{

    // Preparing Data
    const tableName = toSnakeCase(jobData.table)

    // Argument binding list for query
    const args: string[] = []
    let argCount = 0;

    let selectionPieces: string[] = []
    if (jobData.selection && jobData.selection.length > 0) {
        for (let s of jobData.selection) {
            selectionPieces.push(toSnakeCase(s))
        }
    } else {
        selectionPieces.push("*")
    }


    let wherePieces: string[] = []
    if (jobData.where) {
        for (let k in jobData.where) {
            wherePieces.push(`${toSnakeCase(k)} = $${++argCount}`)
            args.push(jobData.where[k])
        }
    }


    // Build Query
    let query = `SELECT ${selectionPieces.join(", ")} FROM ${tableName}`
    if (wherePieces.length > 0) {
        query += ` WHERE ${wherePieces.join(' AND ')}`
    }

    return {query, args}
}

/**
 * Build INSERT query
 * can be executed on pg postgres client
 * @param jobData
 */
export function qb_INSERT(jobData: QBJob_INSERT) {

    // Preparing Data
    const tableName = toSnakeCase(jobData.table)

    // Argument binding list for query
    const args: string[] = []
    let argCount = 0;

    let columns: string[] = []
    let values: string[] = []
    for (let k in jobData.insert) {
        columns.push(`${toSnakeCase(k)}`)
        values.push(`$${++argCount}`)
        args.push(jobData.insert[k])
    }

    // Build Query
    let query = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${values.join(", ")})`

    return {query, args}
}


/**
 * Build UPDATE query
 * can be executed on pg postgres client
 * @param jobData
 */
export function qb_UPDATE(jobData: QBJob_UPDATE) {

    // Preparing Data
    const tableName = toSnakeCase(jobData.table)

    // Argument binding list for query
    const args: string[] = []
    let argCount = 0;

    let updatePieces: string[] = []
    for (let k in jobData.update) {
        updatePieces.push(`${toSnakeCase(k)} = $${++argCount}`)
        args.push(jobData.update[k])
    }

    let wherePieces: string[] = []
    if (jobData.where) {
        for (let k in jobData.where) {
            wherePieces.push(`${toSnakeCase(k)} = $${++argCount}`)
            args.push(jobData.where[k])
        }
    }

    // Build Query
    let query = `UPDATE ${tableName} SET ${updatePieces.join(", ")}`
    if (wherePieces.length > 0) {
        query += ` WHERE ${wherePieces.join(' AND ')}`
    }

    return {query, args}
}


