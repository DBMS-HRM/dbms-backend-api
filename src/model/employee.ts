import {cleanQuery, MError, qb, runQuery, runTrx} from "../utils/db";
import * as interfaces from "./interfaces";

const TABLE = {
    employeeAccount: "employeeAccount",
    adminAccount: "adminAccount",
    employeeCompanyDetail: "employeeCompanyDetail",
    employeePersonalDetail: "employeePersonalDetail",
    employeeEmergencyDetail: "employeeEmergencyDetail",
    customDetails: "customDetails",
    employmentStatus: "employmentStatus",
    phoneNumber: "phoneNumber",
    employeeDetailsFull: "employeeDetailsFull",
    supervisorEmployees : "supervisorEmployees"
};


export default abstract class Employee {
    static job_titles = {
        HRManager: "HR Manager",
        QAEngineer: "QA Engineer",
        Accountant: "Accountant",
        SoftwareEngineer: "Software Engineer"
    };

    static user_account_types = {
        managerialEmployee: "Managerial Employee",
        employee: "Employee"
    };

    static admin_account_types = {
        admin: "Admin",
        superAdmin: "Super Admin"
    };

    static pay_grade = {
        level1: "Level 1",
        level2: "Level 2",
        level3: "Level 3"
    };

    static employment_status = {
        interFullTime: "Intern Full Time",
        interPartTime: "Intern Part Time",
        contractFullTime: "Contract Full Time",
        contractPartTime: "Contract Part Time",
        permanent: "Permanent",
        freelance: "Freelance"
    };

    /**
     * SELECT Queries ------------------------------------------------------------------------------
     */
    static getEmployeeAccount(username: string): Promise<[MError, interfaces.EmployeeAccount]> {
        return runQuery(
            qb(TABLE.employeeAccount).where({username}),
            {single: true, required: true}
        );
    };

    /**
     * Get admin account by username
     * @param username
     */
    static getAdminAccount(username: string): Promise<[MError, interfaces.AdminAccount]> {
        return runQuery(
            qb(TABLE.adminAccount).where({username}),
            {single: true, required: true}
        );
    };

    /**
     * Get a view profile
     */
    static getEmployeeFullDetail(employeeId: string): Promise<[MError, any]> {
        return runQuery(
            qb(TABLE.employeeDetailsFull).where({employeeId}),
            {single: true, required: true}
        );
    };

    /**
     * Get employee company and personal details
     */
    static getEmployeeCP(query : any): Promise<[MError, any]> {
        const q = cleanQuery(
            query,
            ["jobTitle", "payGrade", "employeeId", "departmentName", "supervisorId", "employmentStatus", "firstName","lastName"]
        )
        if(q.hasOwnProperty("employeeId")){
            q["employeeCompanyDetail.employeeId"] = q["employeeId"];
            delete q["employeeId"];
        }
        return runQuery(
            qb(TABLE.employeeCompanyDetail)
                .leftJoin(TABLE.employeePersonalDetail,
                    "employeeCompanyDetail.employeeId","=","employeePersonalDetail.employeeId")
                .where(q)
                .select()
        );
    };

    /**
     * Check whether supervisor or not
     */
    static checkSupervisor(supervisorId: string): Promise<[MError, any]> {
        return runQuery(
            qb().raw(`select is_supervisor($1 :: uuid)`, [supervisorId])
        );
    };


    /**
     * INSERT Queries ----------------------------------------------------------------------------------------
     */

    static addAdminUser(adminAccountData: interfaces.AdminAccount) {
        return runQuery(
            qb(TABLE.adminAccount).insert(adminAccountData)
        );
    }

    static addEmployeeAccount(employeeAccountData: interfaces.EmployeeAccount,
                              employeeCompanyData: interfaces.EmployeeCompanyDetail,
                              employeeEmergencyData: interfaces.EmployeeEmergencyDetail,
                              employeePersonalData: interfaces.EmployeePersonalDetail,
                              phoneNumber: interfaces.PhoneNumber,
                              employeeCustomData: any
    ) {
        return runTrx(
            qb(TABLE.employeeCompanyDetail).insert(employeeCompanyData),
            qb(TABLE.employeeAccount).insert(employeeAccountData),
            qb(TABLE.employeePersonalDetail).insert(employeePersonalData),
            qb(TABLE.employeeEmergencyDetail).insert(employeeEmergencyData),
            qb(TABLE.phoneNumber).insert(phoneNumber),
            qb(TABLE.customDetails).insert(employeeCustomData)
        );
    };


    /**
     * UPDATE Queries ----------------------------------------------------------------------------------------
     */
    static setSupervisor(employeeId: string, supervisorId: string) {
        return runQuery(
            qb(TABLE.employeeCompanyDetail).update({supervisorId}).where({employeeId})
        );
    }

}

