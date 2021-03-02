import { cleanQuery, MError, qb, runQuery } from "../utils/db";
import * as interfaces from "./interfaces";

const TABLE = {
    metaData : "metaData",
};

export default abstract class MetadataModel {
    /**
     * Get metadata
     */
    static getMetadata(): Promise<[MError, interfaces.LeaveRequest[]]> {
        return runQuery(
            qb(TABLE.metaData).select()
        )
    }

}
