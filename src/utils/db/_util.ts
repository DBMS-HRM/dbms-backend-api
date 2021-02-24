/**
 * Clean Query
 * @param query
 * @param fields
 */

export function cleanQuery(query: any, fields: string[]) {
    const qClone = {...query}
    Object.keys(qClone).forEach(
        (k) => {
            if (fields.includes(k)) {
                (qClone[k] === null || qClone[k] === undefined) && delete qClone[k]
            } else {
                delete qClone[k]
            }

        }
    )

    return qClone
}
