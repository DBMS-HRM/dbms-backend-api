require("dotenv").config();
import {Pool, PoolConfig} from "pg";
import {dbError_toMError, Error, NoError, NotFound} from "./error";
import {arrToCamelCase, objToCamelCase} from "./typo";


/**
 █▀▀ █▀▀█ █▀▀▄ █▀▀▄ █▀▀ █▀▀ ▀▀█▀▀ ░▀░ █▀▀█ █▀▀▄
 █░░ █░░█ █░░█ █░░█ █▀▀ █░░ ░░█░░ ▀█▀ █░░█ █░░█
 ▀▀▀ ▀▀▀▀ ▀░░▀ ▀░░▀ ▀▀▀ ▀▀▀ ░░▀░░ ▀▀▀ ▀▀▀▀ ▀░░▀
 */

/**
 * Reading environmental variables
 */
const PG_HOST = process.env.PG_HOST;
const PG_PORT = Number(process.env.PG_PORT) || 5432;
const PG_DATABASE = process.env.PG_DATABASE;
const PG_USER = process.env.PG_USER;
const PG_PASS = process.env.PG_PASS;

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
};

/**
 * Postgresql Connection Pool
 */
export const pool = new Pool(poolConfig);


/**
 █▀▀ █░█ █▀▀ █▀▀ █░░█ ▀▀█▀▀ █▀▀█ █▀▀█ █▀▀
 █▀▀ ▄▀▄ █▀▀ █░░ █░░█ ░░█░░ █░░█ █▄▄▀ ▀▀█
 ▀▀▀ ▀░▀ ▀▀▀ ▀▀▀ ░▀▀▀ ░░▀░░ ▀▀▀▀ ▀░▀▀ ▀▀▀
 */

interface IQBuilder {
    query: { query: string, args: string[] }
}

interface RunQueryConfig {
    single?: boolean
    required?: boolean
}

/**
 * Run Transaction
 */
export async function runTrx<T>(...qbs: IQBuilder[]): Promise<[Error, T]> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN')

        let result: any;
        for (let qb of qbs) {
            const qPackage = qb.query;
            const {rows} = await client.query(qPackage.query, qPackage.args);
            result = rows;
        }

        await client.query('COMMIT')
        return [NoError, result as T];
    } catch (e) {
        await client.query('ROLLBACK')
        return [dbError_toMError(e), {} as T];
    } finally {
        client.release();
    }
}


/**
 * Run Standalone Query
 */
export async function runQuery<T>(
    qb: IQBuilder,
    config: RunQueryConfig = {}
): Promise<[Error, T]> {
    const client = await pool.connect();
    try {
        const qPackage = qb.query;
        const {rows} = await client.query(qPackage.query, qPackage.args);

        const data = (config.single)? objToCamelCase(rows[0]): arrToCamelCase(rows)
        // console.log(config.required, data, data.length )
        if (config.required && config.single && (!data || Object.keys(data).length === 0)) {
            return [NotFound, {} as T]
        }

        return [NoError, data as T];
    } catch (e) {
        return [dbError_toMError(e), {} as T];
    } finally {
        client.release();
    }
}

/**
 * ----------------------------------------------------------------------------------------------------------
 */