require("dotenv").config();
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const {Pool} = require('pg')

/**
 ▒█░▒█ ▀▀█▀▀ ▀█▀ ▒█░░░ ▒█▀▀▀█
 ▒█░▒█ ░▒█░░ ▒█░ ▒█░░░ ░▀▀▀▄▄
 ░▀▄▄▀ ░▒█░░ ▄█▄ ▒█▄▄█ ▒█▄▄▄█
 */

async function input(prompt) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve, reject) => {
        rl.question(prompt, (inp) => {
            resolve(inp)
            rl.close()
        })
    })
}

function readFile(dir, name) {
    return fs.readFileSync(path.join(dir, name), 'utf-8')
}

function listFiles(dir) {
    return fs.readdirSync(dir)
}


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
const poolConfig = {
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
const pool = new Pool(poolConfig);


async function runTrx(queries) {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        for (let q of queries) {
            const res = await client.query(q);
            console.log(q)
            console.log('-- DONE')
        }
        await client.query('COMMIT')
    } catch (e) {
        await client.query('ROLLBACK')
        console.log('\nERROR: ', e.message)
        console.log("Executed statements will reset")
        process.exit(0)
    } finally {
        client.release();
    }
}

async function runQuery(queries) {
    try {
        for (let q of queries) {
            const client = await pool.connect()
            const res = await client.query(q);
            client.release()
            console.log(q)
            console.log('-- DONE')
        }
    } catch (e) {
        console.log('\nERROR: ', e.message)
        process.exit(0)
    }
}


/**
 *
 ▒█▀▀█ ░█▀▀█ ▒█▀▀█ ▒█▀▀▀█ ▒█▀▀▀ ▒█▀▀█ ▒█▀▀▀█
 ▒█▄▄█ ▒█▄▄█ ▒█▄▄▀ ░▀▀▀▄▄ ▒█▀▀▀ ▒█▄▄▀ ░▀▀▀▄▄
 ▒█░░░ ▒█░▒█ ▒█░▒█ ▒█▄▄▄█ ▒█▄▄▄ ▒█░▒█ ▒█▄▄▄█
 */


const DIR_SQL = path.join(process.cwd(), 'sql')
const DIR_TABLE = path.join(DIR_SQL, 'tables')
const DIR_FUNC = path.join(DIR_SQL, 'functions')
const DIR_SEED = path.join(DIR_SQL, 'seeds')

/**
 * File Handling
 */

function sqlFileList(path) {
    const file_list = fs.readdirSync(path)
    return file_list.filter(name => Boolean(name.match(/.sql$/))).sort()
}


/**
 * Text parsing
 */

function cleanSQLText(text) {
    return text.replace(/-- .*/g, '')
        .replace(/\n/g, ' ')
        .replace(/ +/g, ' ')
}

function statements(text) {
    return text.split('; ').map(s => s.replace(/^ /, ''))
}

function filterDownStatements(statements) {
    return statements.filter(s => s.match(/DROP/))
}

function filterUpStatements(statements) {
    return statements.filter(s => s.match(/CREATE/))
}

function filterInsertStatements(statements) {
    return statements.filter(s => s.match(/INSERT/))
}

/**
 ▒█▀▀█ ▒█░░░ ▀█▀
 ▒█░░░ ▒█░░░ ▒█░
 ▒█▄▄█ ▒█▄▄█ ▄█▄
 */

async function selectChoice(prompt, options, sep = '\n') {
    console.log(prompt)
    for (let i = 0; i < options.length; i++) {
        process.stdout.write(`\t${String(i + 1).padStart(2)} - ${options[i]} \n`)
    }
    const userInput = await input(":: ")

    if (['a', 'all'].includes(userInput)) {
        return options
    }

    try {
        const pieces = userInput.split(' ')
        const choices = []
        for (let p of pieces) {
            const rngMatch = p.match(/(\d+):(\d+)/)
            if (rngMatch) {
                const start = Number(rngMatch[1]) - 1
                const end = Number(rngMatch[2]) - 1
                for (let i = start; i <= end; i++) {
                    choices.push(options[i])
                }
            } else {
                const vMatch = p.match(/(\d+)/)
                if (vMatch) {
                    const ind = Number(vMatch[1]) - 1
                    choices.push(options[ind])
                }
            }
        }
        return choices
    } catch (e) {
        return []
    }

}


const modes = [
    'CREATE',
    'DROP'
]

const types = [
    'TABLE',
    'FUNC',
    'SEED'
]

async function main() {

    // Select Type
    const selectedType = (await selectChoice('select migration type:', types, ''))
    if (selectedType.length < 1) {
        console.log('DONE!')
        process.exit(0)
    }
    const type = selectedType[0]
    console.log('USING TYPE:', type)

    if (type === "TABLE") {
        const selected_files = (await selectChoice('select files:', await sqlFileList(DIR_TABLE)))

        // Select Mode
        const selectedMode = (await selectChoice('select execution mode:', modes, ''))
        if (selectedMode.length < 1) {
            console.log('DONE!')
            process.exit(0)
        }
        const mode = selectedMode[0]
        console.log('USING MODE:', mode)

        let queries = []
        for (let f of selected_files) {
            console.log(`reading file '${f}'`)
            if (mode === 'DROP') {
                queries.push(...filterDownStatements(statements(cleanSQLText(readFile(DIR_TABLE, f)))))
            } else {
                queries.push(...filterUpStatements(statements(cleanSQLText(readFile(DIR_TABLE, f)))))
            }
        }
        await runTrx(queries)

    } else if (type === "SEED") {
        const selected_files = (await selectChoice('select files:', await sqlFileList(DIR_SEED)))

        let queries = []
        for (let f of selected_files) {
            console.log(`reading file '${f}'`)
            queries.push(...filterInsertStatements(statements(cleanSQLText(readFile(DIR_SEED, f)))))
        }
        await runTrx(queries)

    } else if (type === "FUNC") {
        const selected_files = (await selectChoice('select files:', await sqlFileList(DIR_FUNC)))
        let queries = []
        for (let f of selected_files) {
            console.log(`reading file '${f}'`)
            queries.push(cleanSQLText(readFile(DIR_SEED, f)))
        }
        await runTrx(queries)
    }

    console.log("FINISHED !")
    process.exit(0)
}

main().then().catch()