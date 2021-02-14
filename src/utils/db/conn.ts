require('dotenv').config()
import {Pool, PoolClient, PoolConfig} from "pg";
import {MError, NoError, dbError_toMError} from "./merror";
import {arrToCamelCase} from "./typo";

/**
 * Reading environmental variables
 */
const PG_HOST       = process.env.PG_HOST
const PG_PORT       = Number(process.env.PG_PORT) || 5432
const PG_DATABASE   = process.env.PG_DATABASE
const PG_USER       = process.env.PG_USER
const PG_PASS       = process.env.PG_PASS

/**
 * Postgresql Connection Pool Configuration
 */
const poolConfig: PoolConfig = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USER,
    password: PG_PASS,
    keepAlive: true,
    query_timeout: 1000
}

/**
 * Postgresql Connection Pool
 */
const pool = new Pool(poolConfig)





/**
 * ----------------------------------------------------------------------------------------------------------
 */

/**
 * Run Transaction
 */
async function runTrx() {
    pool.connect((err, client, done) => {
        const res = client.query('')
    })
}


/**
 * Run Standalone Query
 */
export async function runQuery<T>(queryPack: {query: string, args: string[]}): Promise<[MError, T]> {
    const client = await pool.connect()
    try {
        const res = await client.query(queryPack.query, queryPack.args)
        return [NoError, arrToCamelCase(res.rows) as unknown as T]
    } catch (e) {
        return [dbError_toMError(e), {} as T]
    } finally {
        client.release()
    }
}

/**
 * ----------------------------------------------------------------------------------------------------------
 */