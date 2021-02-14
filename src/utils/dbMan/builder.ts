import {qb_INSERT, qb_SELECT, qb_UPDATE, QBDataType, QBJob, QBJobType} from "./core";

interface SubQBuilder {
    done: () => {query: string, args: string[]}
}

interface SelectQBuilder extends SubQBuilder {
    where: (and: QBDataType) => SelectQBuilder
}

interface InsertQBuilder extends SubQBuilder {
}

interface UpdateQBuilder extends SubQBuilder {
    where: (and: QBDataType) => SelectQBuilder
}

export class QBuilder {
    protected table: string;
    protected type!: QBJobType;

    constructor(table: string) {
        this.table = table;
    }

    select(selection: string[] = []): SelectQBuilder {
        this.type = QBJobType.SELECT;
        return new class implements SelectQBuilder {
            private readonly job: QBJob;
            private readonly selection: string[];
            private whereQuery?: QBDataType;

            constructor(job: QBJob, selection: string[]) {
                this.job = job;
                this.selection = selection;
            }

            where(and: QBDataType) {
                this.whereQuery = and;
                return this;
            }

            done() {
                return qb_SELECT({
                    ...this.job,
                    selection: this.selection,
                    where: this.whereQuery
                });
            }
        }({type: this.type, table: this.table}, selection);
    }

    insert(data: QBDataType): InsertQBuilder {
        this.type = QBJobType.INSERT;
        return new class implements InsertQBuilder {
            private readonly job: QBJob;
            private readonly insert: QBDataType;

            constructor(job: QBJob, insert: QBDataType) {
                this.job = job;
                this.insert = insert;
            }

            done() {
                return qb_INSERT({
                    ...this.job,
                    insert: this.insert
                });
            }
        }({type: this.type, table: this.table}, data);
    }

    update(data: QBDataType): UpdateQBuilder {
        this.type = QBJobType.UPDATE;
        return new class implements UpdateQBuilder {
            private readonly job: QBJob;
            private readonly update: QBDataType;
            private whereQuery?: QBDataType;

            constructor(job: QBJob, update: QBDataType) {
                this.job = job;
                this.update = update;
            }

            where(and: QBDataType) {
                this.whereQuery = and;
                return this;
            }

            done() {
                return qb_UPDATE({
                    ...this.job,
                    update: this.update,
                    where: this.whereQuery
                });
            }
        }({type: this.type, table: this.table}, data);
    }
}
