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
        return runQuery(
            qb().raw(`SELECT  job_title AS heading, json_build_array ('First Name', 'Last Name', 'Status','Department Name', 'Pay Grade') AS columns,
                        jsonb_agg(json_build_object('First Name',  employee_personal_detail.first_name,
                                        'Status',  employee_company_detail.employment_status,
                                        'Last Name', employee_personal_detail.last_name,
                                        'Department Name', employee_company_detail.department_name,
                                        'Pay Grade', employee_company_detail.pay_grade)) AS records
                            FROM employee_company_detail
                            JOIN employee_personal_detail USING(employee_id)
                            JOIN employee_custom_details USING(employee_id)
                                WHERE employee_company_detail.branch_name = $1
                                GROUP BY job_title`,[branchName])
        );
    }

    static reportGroupByPayGrade(branchName : string): Promise<[MError, interfaces.LeaveRequest[]]> {
        return runQuery(
            qb().raw(`SELECT  pay_grade AS heading, json_build_array 
            ('First Name', 'Last Name', 'Status','Job Title', 'Department Name') AS columns,
                        jsonb_agg(json_build_object('First Name',  employee_personal_detail.first_name,
                                        'Status',  employee_company_detail.employment_status,
                                        'Last Name', employee_personal_detail.last_name,
                                        'Job Title', employee_company_detail.job_title,
                                        'Department Name', employee_company_detail.department_name)) AS records
                            FROM employee_company_detail
                            JOIN employee_personal_detail USING(employee_id)
                            JOIN employee_custom_details USING(employee_id)
                                WHERE employee_company_detail.branch_name = $1
                                GROUP BY pay_grade`,[branchName])
        );
    }

    static reportGroupByEmploymentStatus(branchName : string): Promise<[MError, interfaces.LeaveRequest[]]> {
        return runQuery(
            qb().raw(`SELECT  employment_status AS heading, json_build_array ('First Name', 'Last Name', 'Department Name','Job Title', 'Pay Grade') AS columns,
                        jsonb_agg(json_build_object('First Name',  employee_personal_detail.first_name,
                                        'Department Name',  employee_company_detail.department_name,
                                        'Last Name', employee_personal_detail.last_name,
                                        'Job Title', employee_company_detail.job_title,
                                        'Pay Grade', employee_company_detail.pay_grade)) AS records
                            FROM employee_company_detail
                            JOIN employee_personal_detail USING(employee_id)
                            JOIN employee_custom_details USING(employee_id)
                                WHERE employee_company_detail.branch_name = $1
                                GROUP BY employment_status`,[branchName])
        );
    }

    /**
     * Group by custom attributes
     * @param branchName
     */
    static reportGroupByCustomAttributes(branchName : string, customColumn : any): Promise<[MError, interfaces.LeaveRequest[]]> {
        return runQuery(
            qb().raw(`SELECT ${customColumn} AS heading, json_build_array 
            ('First Name', 'Last Name', 'Department Name','Job Title', 'Pay Grade', 'Status') AS columns,
                        jsonb_agg(json_build_object('First Name',  employee_personal_detail.first_name,
                                        'Department Name',  employee_company_detail.department_name,
                                        'Last Name', employee_personal_detail.last_name,
                                        'Job Title', employee_company_detail.job_title,
                                        'Status', employee_company_detail.employment_status,
                                        'Pay Grade', employee_company_detail.pay_grade)) AS records
                            FROM employee_company_detail
                            JOIN employee_personal_detail USING(employee_id)
                            JOIN employee_custom_details USING(employee_id)
                                WHERE employee_company_detail.branch_name = $1
                                GROUP BY employee_custom_details.shift`,[branchName])
        );
    }


}
