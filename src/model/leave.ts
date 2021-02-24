import {runTrx, runQuery, MErr, qb, cleanQuery} from "../utils/db";
import * as interfaces from "./interfaces";

const TABLE = {
    leaveRequest : "leaveRequest",
    leaveType : "leaveType",
    leaveRequestState : "leaveRequestState",
    payGrade : "payGrade"
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
    static get_AllLeaves(query: any): Promise<[MError, interfaces.LeaveRequest[]]> {
        const limit = query.limit || 20 //
        const offset = query.offset || 0 //

        let [orderColumn1, order1] = ["requestDate","desc"];
        (query.orderBy1 != undefined) ? [orderColumn1, order1] = JSON.parse(query.orderBy1) : [orderColumn1, order1];
        // const fromDate = query.fromDate || "2021-02-01";
        // const toDate = query.toDate || new Date();

        const q = cleanQuery(
            query,
            ["leaveType", "leaveState", "leaveId", "employeeId", "supervisorId"]
        )

        return runQuery(
            qb(TABLE.leaveRequest)
                .where(q)
                // .orderBy([orderColumn1])
                .limit(limit).offset(offset)
                .select()
        )
    }


    /**
     * Insert Functions
     */
    static addLeave(leaveRequestData : any){
        return runQuery(
            qb(TABLE.leaveRequest).insert(leaveRequestData )
        )
    }

    /**
     * Update Functions
     */
    static approveLeave(leaveId : string, leaveApproveData : any){
        return runQuery(
            qb(TABLE.leaveRequest).update(leaveApproveData).where({leaveId})
        )
    }

    // Update pay grade leaves
    static updateLeaveConfig(leaveConfig : interfaces.PayGrade){
        const configs = cleanQuery(
            leaveConfig,
            ["payGrade", "annualLeaves", "casualLeaves", "maternityLeaves", "nopayLeaves"]
        )
        console.log(configs);
        return runQuery(
            qb(TABLE.payGrade).update(configs).where({payGrade : configs.payGrade})
        )
    }

}
