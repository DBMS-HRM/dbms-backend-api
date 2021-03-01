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
    supervisorEmployees : "supervisorEmployees",
    employeeLoginDetails : "employeeLoginDetails",
    customAttribute : "customAttribute",
    supervisorEmployeeMv : "supervisorEmployeeMv"

};


export default abstract class User {
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
        level3: "Level 3",
        level4: "Level 4",
        level5: "Level 5",
    };

    static employment_status = {
        interFullTime: "Intern Full Time",
        interPartTime: "Intern Part Time",
        contractFullTime: "Contract Full Time",
        contractPartTime: "Contract Part Time",
        permanent: "Permanent",
        freelance: "Freelance"
    };

    static branch_names = {
        sriLanka : "Sri Lanka",
        bangladesh : "Bangladesh",
        pakistan : "Pakistan"
    }

    /**
     * SELECT Queries ------------------------------------------------------------------------------
     */
    static getEmployeeAccount(username: string): Promise<[MError, interfaces.EmployeeAccount]> {
        return runQuery(
            qb(TABLE.employeeAccount).where({username}),
            {single: true, required: true}
        );
    };

    // Get employee by user id
    static getEmployeeAccountByUserId(employeeId: string): Promise<[MError, interfaces.EmployeeAccount]> {
        return runQuery(
            qb(TABLE.employeeAccount).where({employeeId}),
            {single: true, required: true}
        );
    };

    static getEmployeeLoginData(username: string): Promise<[MError, interfaces.EmployeeLoginDetail]> {
        return runQuery(
            qb(TABLE.employeeLoginDetails).where({username}),
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

    static getAdminAccountByUserId(userId: string): Promise<[MError, interfaces.AdminAccount]> {
        return runQuery(
            qb(TABLE.adminAccount).where({userId}),
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
     * Get all admins query
     */
    static getAllAdmins(query : any): Promise<[MError, any]> {
        const q = cleanQuery(
            query,
            ["userId", "branchName", "email", "username"]
        )
        return runQuery(
            qb(TABLE.adminAccount)
                .where(q)
                .select()
        );
    };

    /**
     * Get employee company and personal details
     */
    static getEmployeeFullReport(query : any): Promise<[MError, any]> {
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
     * Get employee company and personal details
     */
    static getLevel3Employee(query : any): Promise<[MError, any]> {
        const q = cleanQuery(
            query,
            ["jobTitle", "payGrade", "employeeId", "departmentName", "employmentStatus", "firstName","lastName"]
        )
        if(q.hasOwnProperty("employeeId")){
            q["employeeCompanyDetail.employeeId"] = q["employeeId"];
            delete q["employeeId"];
        }
        return runQuery(
            qb(TABLE.employeeCompanyDetail)
                .leftJoin(TABLE.employeePersonalDetail,
                    "employeeCompanyDetail.employeeId","=","employeePersonalDetail.employeeId")
                .leftJoin(TABLE.supervisorEmployeeMv,
                    "employeeCompanyDetail.employeeId","=","supervisorEmployeeMv.supervisorId")
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
                              phoneNumber: any,
                              employeeCustomData: any
    ) {
        return runTrx(
            // qb(TABLE.employeeCompanyDetail).insert(employeeCompanyData),
            // qb(TABLE.employeeAccount).insert(employeeAccountData),
            // qb(TABLE.employeePersonalDetail).insert(employeePersonalData),
            // qb(TABLE.employeeEmergencyDetail).insert(employeeEmergencyData),
            // qb(TABLE.customDetails).insert(employeeCustomData),
            this.setPhoneNumbers(phoneNumber.employeeId, phoneNumber)
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

    static setPhoneNumbers(employeeId : string, phoneNumbers : any){
        if(phoneNumbers == null){
            return qb()
        }
        const mobiles = phoneNumbers.phoneNumbers;
        return qb().raw(`call set_phone_numbers($1 , $2)`, [employeeId, mobiles]);
    }

    static updateEmployeePersonalInfo(employeeId : string, personalData : any,
                                      emergencyData : any, phoneNumbers : any) {
        const personalD = cleanQuery(personalData);
        const emergencyD = cleanQuery(emergencyData);
        const phoneD = cleanQuery(phoneNumbers);
        return runTrx(
            qb(TABLE.employeePersonalDetail).update(personalD).where({employeeId}),
            qb(TABLE.employeeEmergencyDetail).update(emergencyD).where({employeeId}),
            this.setPhoneNumbers(employeeId, phoneD)
        );
    }

    static updateEmployeeInfo(employeeId: string,
                              employeeCompanyData: any,
                              employeeEmergencyData: any,
                              employeePersonalData: any,
                              employeeCustomData: any,
                              phoneNumbers : any
                              )
    {

        return runTrx(
            qb(TABLE.employeeCompanyDetail).update(cleanQuery(employeeCompanyData)).where({employeeId}),
            qb(TABLE.employeePersonalDetail).update(cleanQuery(employeePersonalData)).where({employeeId}),
            qb(TABLE.employeeEmergencyDetail).update(cleanQuery(employeeEmergencyData)).where({employeeId}),
            qb(TABLE.customDetails).update(cleanQuery(employeeCustomData)).where({employeeId}),
            this.setPhoneNumbers(employeeId, cleanQuery(phoneNumbers))
        );
    }

    static changePasswordEmployee(employeeId : string,newPassword : string){
        return runQuery(
            qb(TABLE.employeeAccount).update({password : newPassword}).where({employeeId})
        )
    }

    static changePasswordAdmin(userId : string,newPassword : string){
        return runQuery(
            qb(TABLE.adminAccount).update({password : newPassword}).where({userId})
        )
    }


}

