import {qb_INSERT, qb_SELECT, qb_UPDATE, QBDataType, QBJobType} from "./core";

export class QBuilder {
    private table: string;
    private type: QBJobType;

    private updateData!: QBDataType;
    private insertData!: QBDataType;

    private selections?: string[];
    private whereCond?: QBDataType;

    private rawQuery!: string;
    private rawQArgs?: string []

    constructor(table?: string) {
        this.table = table || '';
        this.type = QBJobType.SELECT
    }

    from(table: string): QBuilder {
        this.type = QBJobType.SELECT
        this.table = table
        return this;
    }

    where(and: QBDataType): QBuilder {
        this.whereCond = and;
        return this;
    }

    select(...selection: string[]): QBuilder {
        this.type = QBJobType.SELECT;
        this.selections = selection
        return this
    }

    insert(data: QBDataType): QBuilder {
        this.type = QBJobType.INSERT;
        this.insertData = data
        return this
    }

    update(data: QBDataType): QBuilder {
        this.type = QBJobType.UPDATE;
        this.updateData = data
        return this
    }

    raw(query: string, args: string[]) {
        this.type = QBJobType.RAW
        this.rawQuery = query
        this.rawQArgs = args
    }

    get query(): {query: string, args: string[]} {
        switch (this.type) {
            case QBJobType.SELECT:
                return qb_SELECT({
                    type: this.type,
                    table: this.table,
                    selection: this.selections,
                    where: this.whereCond
                })
            case QBJobType.INSERT:
                return qb_INSERT({
                    type: this.type,
                    table: this.table,
                    insert: this.insertData
                })
            case QBJobType.UPDATE:
                return qb_UPDATE({
                    type: this.type,
                    table: this.table,
                    update: this.updateData,
                    where: this.whereCond
                })
            case QBJobType.RAW:
                return {query: this.rawQuery, args: this.rawQArgs || []}
            default:
                return {query: '', args: []}
        }
    }
}
