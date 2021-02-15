import {toCamelCase} from "./typo";

export enum ErrorCode {
    NO_ERROR,
    UNKNOWN,
    NOT_FOUND,
    DB_CONNECTION,
    DUPLICATE_ENTRY
}

export interface Error {
    code: ErrorCode,
    constraint?: string,
    table?: string,
}

export const NoError: Error = {code: ErrorCode.NO_ERROR}
export const NotFound: Error = {code: ErrorCode.NOT_FOUND}


export const dbError_toMError = (error: any): Error => {
    switch (error.code) {
        case 'ECONNREFUSED':
            console.log("[ERROR][DB]: Couldn't Connect to Database.")
            return {code: ErrorCode.DB_CONNECTION};
        case "23505":
            console.log("[ERROR][DB]: Duplicate Database Entry.")
            return {
                code: ErrorCode.DUPLICATE_ENTRY,
                constraint: error.constraint,
                table: toCamelCase(error.table),
            };
        default:
            console.log("[ERROR][DB]: Unknown error with code ", error.code);
            console.log(error.message)
            return {code: ErrorCode.UNKNOWN,};
    }
}