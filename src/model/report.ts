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
                        jsonb_agg(json_build_object('First Name',  employee_personal_detail.first_name,
                                        'Status',  employee_company_detail.employment_status,
                                        'Last Name', employee_personal_detail.last_name,
                                        'Job Title', employee_company_detail.job_title,
                                        'Pay Grade', employee_company_detail.pay_grade)) AS records
                            FROM employee_company_detail
                            JOIN employee_personal_detail USING(employee_id)
                            JOIN employee_custom_details USING(employee_id)
                                WHERE employee_company_detail.branch_name = $1
                                GROUP BY department_name`,[branchName])
        );
    }

    static reportGroupByJobTitle(branchName : string): Promise<[MError, interfaces.LeaveRequest[]]> {
        console.log();
        return runQuery(
            qb().raw(`SELECT  department_name AS heading, json_build_array ('First Name', 'Last Name', 'Status','Job Title', 'Pay Grade') AS columns,
                        jsonb_agg(json_build_object('First Name',  employee_personal_detail.first_name,
                                        'Status',  employee_company_detail.employment_status,
                                        'Last Name', employee_personal_detail.last_name,
                                        'Job Title', employee_company_detail.job_title,
                                        'Pay Grade', employee_company_detail.pay_grade)) AS records
                            FROM employee_company_detail
                            JOIN employee_personal_detail USING(employee_id)
                            JOIN employee_custom_details USING(employee_id)
                                WHERE employee_company_detail.branch_name = $1
                                GROUP BY department_name`,[branchName])
        );
    }

    static reportGroupByPayGrade(branchName : string): Promise<[MError, interfaces.LeaveRequest[]]> {
        console.log();
        return runQuery(
            qb().raw(`SELECT  department_name AS heading, json_build_array ('First Name', 'Last Name', 'Status','Job Title', 'Pay Grade') AS columns,
                        jsonb_agg(json_build_object('First Name',  employee_personal_detail.first_name,
                                        'Status',  employee_company_detail.employment_status,
                                        'Last Name', employee_personal_detail.last_name,
                                        'Job Title', employee_company_detail.job_title,
                                        'Pay Grade', employee_company_detail.pay_grade)) AS records
                            FROM employee_company_detail
                            JOIN employee_personal_detail USING(employee_id)
                            JOIN employee_custom_details USING(employee_id)
                                WHERE employee_company_detail.branch_name = $1
                                GROUP BY department_name`,[branchName])
        );
    }

    static reportGroupByEmploymentStatus(branchName : string): Promise<[MError, interfaces.LeaveRequest[]]> {
        console.log();
        return runQuery(
            qb().raw(`SELECT  department_name AS heading, json_build_array ('First Name', 'Last Name', 'Status','Job Title', 'Pay Grade') AS columns,
                        jsonb_agg(json_build_object('First Name',  employee_personal_detail.first_name,
                                        'Status',  employee_company_detail.employment_status,
                                        'Last Name', employee_personal_detail.last_name,
                                        'Job Title', employee_company_detail.job_title,
                                        'Pay Grade', employee_company_detail.pay_grade)) AS records
                            FROM employee_company_detail
                            JOIN employee_personal_detail USING(employee_id)
                            JOIN employee_custom_details USING(employee_id)
                                WHERE employee_company_detail.branch_name = $1
                                GROUP BY department_name`,[branchName])
        );
    }


}
