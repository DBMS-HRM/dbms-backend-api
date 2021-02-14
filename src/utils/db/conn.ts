require("dotenv").config();
import {Pool, PoolConfig} from "pg";
import {dbError_toMError, MError, NoError, NotFound} from "./merror";
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
async function runTrx() {
    pool.connect((err, client, done) => {
        const res = client.query("");
    });
}


/**
 * Run Standalone Query
 */
export async function runQuery<T>(
    qb: IQBuilder,
    config: RunQueryConfig = {}
): Promise<[MError, T]> {
    const client = await pool.connect();
    try {
        const qPackage = qb.query;
        const {rows} = await client.query(qPackage.query, qPackage.args);

        const data = (config.single)? objToCamelCase(rows[0]): arrToCamelCase(rows)
        if (config.required && (!data || data.length === 0)) {
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