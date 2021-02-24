import {runTrx, runQuery, MErr, qb} from "../utils/db";
import * as interfaces from "./interfaces";

const TABLE = {
    leaveRequest : "leaveRequest",
    leaveType : "leaveType",
    leaveRequestState : "leaveRequestState",
}


export default abstract class LeaveModel {
    static leaveTypes = {
        annual : "Annual",
        casual : "Casual",
        maternity : "Maternity",
        noPay : "No-pay"
    }

    static leaveRequestStates = {
        pending : "Pending",
        approved : "Approved",
        rejected : "Rejected"
    }

    /**
     * Querying Data
     */



    /**
     * Insert Functions
     */
    static addLeave(leaveRequestData : any){
        return runQuery(
            qb(TABLE.leaveRequest).insert(leaveRequestData )
        )
    }

}
