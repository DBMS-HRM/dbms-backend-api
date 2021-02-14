import {qb_INSERT, qb_SELECT, qb_UPDATE, QBDataType, QBJob, QBJobType} from "./core";

export class QBuilder {
    private readonly table: string;
    private type: QBJobType;
    private updateData!: QBDataType;
    private insertData!: QBDataType;
    private selections?: string[];
    private whereCond?: QBDataType;

    constructor(table: string) {
        this.table = table;
        this.type = QBJobType.SELECT
    }


    where(and: QBDataType): QBuilder {
        this.whereCond = and;
        return this;
    }

    select(selection: string[] = []): QBuilder {
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

    done(): {query: string, args: string[]} {
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
            default:
                return {query: '', args: []}
        }
    }
}
