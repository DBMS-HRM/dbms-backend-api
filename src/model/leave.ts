import { cleanQuery, MError, qb, runQuery } from "../utils/db";
import * as interfaces from "./interfaces";

const TABLE = {
  leaveRequest: "leaveRequest",
  leaveType: "leaveType",
  leaveRequestStatus: "leaveRequestStatus",
  payGrade: "payGrade",
  supervisorLeaveRequest: "supervisorLeaveRequest",
  employeeRemainingLeaves: "employeeRemainingLeaves",
};

export default abstract class LeaveModel {
  static leaveTypes = {
    annual: "Annual",
    casual: "Casual",
    maternity: "Maternity",
    noPay: "No-pay",
  };

  static leaveRequestStates = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };

  /**
   * Querying Data
   */
  static get_AllLeaves(
    query: any
  ): Promise<[MError, interfaces.LeaveRequest[]]> {

    const limit = query.limit || 1000; //
    const offset = query.offset || 0; //

    // let [orderColumn1, order1] = ["requestDate", "desc"];
    // query.orderBy1 != undefined
    //   ? ([orderColumn1, order1] = JSON.parse(query.orderBy1))
    //   : [orderColumn1, order1];
    // const fromDate = query.fromDate || "2021-02-01";
    // const toDate = query.toDate || "2025-05-06";

    const q = cleanQuery(query, [
      "leaveType", "jobTitle",
      "leaveStatus", "payGrade",
      "leaveId",
      "employeeId",
      "supervisorId",
        "departmentName", "branchName", "reviewedDate"
    ]);
    return runQuery(
      qb(TABLE.supervisorLeaveRequest)
        .where(q)
        .limit(limit)
        .offset(offset)
        .select()
    );
  }

  /**
   * Leave report
   * @param query
   */
  static get_LeaveReport(
    query: any
  ): Promise<[MError, interfaces.LeaveRequest[]]> {
    const fromDate = query.fromDate || "2021-02-01";
    const toDate = query.toDate || new Date();

    return runQuery(
      qb().raw(
        "select \n" +
          "\tdepartment_name ,\n" +
          "\tleave_type ,\n" +
          "\tcount(*) as total_leaves\n" +
          "\tfrom supervisor_leave_request slr\n" +
          "\twhere\n" +
          "\tfrom_date between $1 and $2\n" +
          "\tgroup by department_name, leave_type",
        [fromDate, toDate]
      )
    );
  }

  // Get leave configs -> pay grade
  static getLeaveConfig() {
    return runQuery(qb(TABLE.payGrade).select());
  }

  // Get remaining leave counts per each user
  static getRemainingLeaves(employeeId: string) {
    return runQuery(
      qb(TABLE.employeeRemainingLeaves).where({ employeeId }).select()
    );
  }

  /**
   * Insert Functions
   */
  static addLeave(leaveRequestData: any) {
    return runQuery(qb(TABLE.leaveRequest).insert(leaveRequestData));
  }

  /**
   * Update Functions
   */
  static changeLeaveStatus(leaveId: string, approvedData: any) {
    return runQuery(
      qb(TABLE.leaveRequest).update(approvedData).where({ leaveId })
    );
  }

  // Update pay grade leaves
  static updateLeaveConfig(leaveConfig: interfaces.PayGrade) {
    const configs = cleanQuery(leaveConfig, [
      "payGrade",
      "annualLeaves",
      "casualLeaves",
      "maternityLeaves",
      "nopayLeaves",
    ]);
    return runQuery(
      qb(TABLE.payGrade).update(configs).where({ payGrade: configs.payGrade })
    );
  }
}
