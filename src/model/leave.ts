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
  static get_LeaveReport( query: any ): Promise<[MError, interfaces.LeaveRequest[]]> {
    const fromDate = query.fromDate || "2020-02-01";
    const toDate = query.toDate || "2040-02-01";
    const branchName = query.branchName;
    return runQuery(
      qb().raw(
        `SELECT rr.department_name, 
        json_agg(jsonb_build_object(leave_type, leave_count)) AS leave_count FROM 
        (SELECT ecd.department_name, lr.leave_type, SUM(real_difference($1::DATE, 
        lr.from_date, lr.to_date, $2::DATE)) AS leave_count
            FROM leave_request lr
            JOIN employee_company_detail ecd USING (employee_id)
                WHERE ecd.branch_name = $3
                GROUP BY ecd.department_name, lr.leave_type) rr
                    GROUP BY rr.department_name`,
        [fromDate, toDate , branchName]
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
