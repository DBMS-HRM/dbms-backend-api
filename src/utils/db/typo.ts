/**
 * Convert camel case string to snake case
 * detect points only when there is a capital letter followed by a simple letter
 * @param text
 */
export function toSnakeCase(text: string) {
    return text.replace(/([a-z])([A-Z])/g, (l1, l2, l3) => `${l2}_${l3.toLowerCase()}`);
}

/**
 * Convert snake case string to camel case
 * detect points when there is a simple letter followed by a underscore
 * @param text
 */
export function toCamelCase(text: string) {
    return text.replace(/_([a-z])/g, (l1, l2) => `${l2.toUpperCase()}`);
}

/**
 * Perform a same string operation on each keys
 * @param obj       : Object
 * @param convertor : Function which perform string operation
 */
function _changeKeys(obj: {[key: string]: any}, convertor: (i: string) => string) {
    const converted: any = {}
    for (let k in obj) {
        converted[convertor(k)] = obj[k]
    }
    return converted;
}

/**
 * Convert all key string from snake case to camel case
 * @param obj
 */
export function objToCamelCase(obj: {[key: string]: any}) {
    return _changeKeys(obj, toCamelCase)
}

/**
 * Convert all key string from camel case to snake case
 * @param obj
 */
export function objToSnakeCase(obj: {[key: string]: any}) {
    return _changeKeys(obj, toSnakeCase)
}

/**
 * Convert array of object into camelCase form
 */
export function arrToCamelCase(arr: {[key: string]: any}[]): {[key: string]: any}[] {
    return arr.map(objToCamelCase)
}

