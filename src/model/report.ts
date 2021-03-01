import { cleanQuery, MError, qb, runQuery } from "../utils/db";
import * as interfaces from "./interfaces";

const TABLE = {
    employeeCompanyDetail: "employeeCompanyDetail",
    employeePersonalDetail: "employeePersonalDetail",
    employeeCustomDetail: "employeeCustomDetails",
};

export default abstract class ReportModel {
    static default_group_by = {
       departmentName : "departmentName",
       jobTitle : "jobTitle",
       payGrade : "payGrade",
       employmentStatus : "employmentStatus",
    }

    /**
     * Querying Report
     */
    static reportGroupByDepartmentName(branchName : string): Promise<[MError, interfaces.LeaveRequest[]]> {
        console.log();
        return runQuery(
            qb().raw(`SELECT  department_name AS heading, json_build_array ('First Name', 'Last Name', 'Status','Job Title', 'Pay Grade') AS columns,
                        jsonb_agg(json_build_object('First Name',  epd.first_name,
                                        'Status', ecd.employment_status,
                                        'Last Name', epd.last_name,
                                        'Job Title', employee_company_detail.job_title
                                        'Pay Grade', employee_company_detail.pay_grade)) AS records
                            FROM employee_company_detail ecd
                            JOIN employee_personal_detail epd USING(employee_id)
                            JOIN employee_custom_details ecd2 USING(employee_id)
                                WHERE ecd.branch_name = $1
                                GROUP BY department_name`,[branchName])
        );
    }


}
