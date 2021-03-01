import {_QBJob_SELECT_JOIN, qb_DELETE, qb_INSERT, qb_SELECT, qb_UPDATE, QBDataType, QBJobType} from "./core";

type JoinType = "JOIN" | "LEFT JOIN" | "RIGHT JOIN"

export class QBuilder {
    private table: string;
    private alias: string;
    private type: QBJobType;

    private selectionList?: string[];
    private joinsList?: _QBJob_SELECT_JOIN[];
    private orderByList?: string[];
    private limitValue?: number;
    private offsetValue?: number;

    private updateData!: QBDataType;
    private insertData!: QBDataType;

    private whereType?: 'AND' | 'OR' | 'BETWEEN';
    private whereCond?: QBDataType;

    private rawQuery!: string;
    private rawQArgs?: string [];

    constructor(table?: string, alias: string = "") {
        this.table = table || "";
        this.type = QBJobType.SELECT;
        this.alias = alias;
    }

    from(table: string, alias: string = ""): QBuilder {
        this.type = QBJobType.SELECT;
        this.table = table;
        this.alias = alias;
        return this;
    }

    where(and: QBDataType): QBuilder {
        this.whereType = 'AND'
        this.whereCond = and;
        return this;
    }

    whereOr(or: QBDataType): QBuilder {
        this.whereType = 'OR'
        this.whereCond = or;
        return this;
    }

    whereBetween(column: string, lower: any, upper: any): QBuilder {
        this.whereType = 'BETWEEN'
        this.whereCond = {column, lower, upper};
        return this;
    }

    select(...selection: string[]): QBuilder {
        this.type = QBJobType.SELECT;
        this.selectionList = selection;
        return this;
    }

    // private _join(type: JoinType, table: string, c1: string, op: string, c2: string): QBuilder
    // private _join(type: JoinType, table: string[], c1: string, op: string, c2: string): QBuilder
    private _join(type: JoinType, table: string | string[], c1: string, op: string, c2: string): QBuilder {
        if (!this.joinsList) this.joinsList = [];
        if (typeof table == "string") {
            this.joinsList?.push({
                type: type,
                table: table,
                alias: "",
                on: {
                    c1, op, c2
                }
            });
        } else {
            this.joinsList?.push({
                type: type,
                table: table[0],
                alias: table[1] || "",
                on: {
                    c1, op, c2
                }
            });
        }
        return this;
    }

    join(table: string | string[], c1: string, op: string, c2: string): QBuilder {
        return this._join(
            "JOIN",
            table, c1, op, c2
        );
    }

    leftJoin(table: string | string[], c1: string, op: string, c2: string): QBuilder {
        return this._join(
            "LEFT JOIN",
            table, c1, op, c2
        );
    }

    rightJoin(table: string | string[], c1: string, op: string, c2: string): QBuilder {
        return this._join(
            "RIGHT JOIN",
            table, c1, op, c2
        );
    }

    orderBy(...columns: string[]): QBuilder {
        this.orderByList = columns;
        return this;
    }

    limit(limit: number): QBuilder {
        this.limitValue = limit;
        return this;
    }

    offset(offset: number): QBuilder {
        this.offsetValue = offset;
        return this;
    }


    insert(data: QBDataType): QBuilder {
        this.type = QBJobType.INSERT;
        this.insertData = data;
        return this;
    }

    update(data: QBDataType): QBuilder {
        this.type = QBJobType.UPDATE;
        this.updateData = data;
        return this;
    }

    delete(): QBuilder {
        this.type = QBJobType.DELETE;
        return this;
    }

    raw(query: string, args: string[]): QBuilder {
        this.type = QBJobType.RAW;
        this.rawQuery = query;
        this.rawQArgs = args;
        return this
    }

    get query(): { query: string, args: string[] } {
        switch (this.type) {
            case QBJobType.SELECT:
                return qb_SELECT({
                    type: this.type,
                    table: this.table, alias: this.alias,
                    selection: this.selectionList,
                    whereType: this.whereType,
                    where: this.whereCond,
                    joins: this.joinsList,
                    orderBy: this.orderByList,
                    limit: this.limitValue,
                    offset: this.offsetValue
                });
            case QBJobType.INSERT:
                return qb_INSERT({
                    type: this.type,
                    table: this.table, alias: this.alias,
                    insert: this.insertData
                });
            case QBJobType.UPDATE:
                return qb_UPDATE({
                    type: this.type,
                    table: this.table, alias: this.alias,
                    update: this.updateData,
                    whereType: this.whereType,
                    where: this.whereCond
                });
            case QBJobType.DELETE:
                return qb_DELETE({
                    type: this.type,
                    table: this.table, alias: this.alias,
                    whereType: this.whereType,
                    where: this.whereCond
                });
            case QBJobType.RAW:
                return {query: this.rawQuery, args: this.rawQArgs || []};
            default:
                return {query: "", args: []};
        }
    }
}
