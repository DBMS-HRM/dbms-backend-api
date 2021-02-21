require('dotenv').config()
import {encrypt_password} from "./utils/hasher";
import {v4} from "uuid";


async function main() {
    console.log(v4())
    console.log(await encrypt_password('admin'))
}

main().then().catch()

