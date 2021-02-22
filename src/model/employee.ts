import {runTrx, runQuery, MErr, qb} from "../utils/db";
import * as interfaces from "./interfaces";

const TABLE = {
    employeeAccount : "employeeAccount",
    adminAccount : "adminAccount",
    employeeCompanyDetail: "employeeCompanyDetail",
    employeePersonalDetail : "employeePersonalDetail",
    employeeEmergencyDetail : "employeeEmergencyDetail",
    customDetails : "customDetails",
    jobTitle : "jobTitle",
    employmentStatus : "employmentStatus",
    branch :  "branch",
    department : "department",
    payGrade : "payGrade",
}


export default abstract class Employee {
    static job_titles = {
        HRManager : "HR Manager",
        QAEngineer : "QA Engineer",
        Accountant : "Accountant",
        SoftwareEngineer : "Software Engineer"
    }

    static user_account_types = {
        managerialEmployee : "Managerial Employee",
        supervisor : "Supervisor",
        employee : "Employee",
    }

    static admin_account_types = {
        admin : "Admin",
        superAdmin : "Super Admin"
    }

    static pay_grade = {
       level1 : "Level 1",
       level2 : "Level 2",
       level3 : "Level 3",
    }

    static employment_status = {
        interFullTime : "Intern Full Time",
        interPartTime : "Intern Part Time",
        contractFullTime : "Contract Full Time",
        contractPartTime : "Contract Part Time",
        permanent : "Permanent",
        freelance : "Freelance"
    };

    /**
     * SELECT Queries ------------------------------------------------------------------------------
     */
    static getEmployeeAccount (username : string ) : Promise<[any, interfaces.EmployeeAccount]> {
        return runQuery(
            qb(TABLE.employeeAccount).where({username})
        );
    };

    /**
     * Get admin account by username
     * @param username
     */
    static getAdminAccount (username : string ) : Promise<[any, interfaces.AdminAccount]> {
        return runQuery(
            qb(TABLE.adminAccount).where({username}),
            {single: true, required: true}
        );
    };

    /**
     * INSERT Queries ----------------------------------------------------------------------------------------
     */

    static addAdminUser (adminAccountData : interfaces.AdminAccount) {
        return runQuery(
            qb(TABLE.adminAccount).insert(adminAccountData)
        )
    }

    static addEmployeeAccount (employeeAccountData: interfaces.EmployeeAccount,
                               employeeCompanyData : interfaces.EmployeeCompanyDetail,
                               employeeEmergencyData : interfaces.EmployeeEmergencyDetail,
                               employeePersonalData : interfaces.EmployeePersonalDetail,
                               employeeCustomData : any
    ){
        return runTrx(
            qb(TABLE.employeeAccount).insert(employeeAccountData),
            qb(TABLE.employeeCompanyDetail).insert(employeeCompanyData),
            qb(TABLE.employeePersonalDetail).insert(employeePersonalData),
            qb(TABLE.employeeEmergencyDetail).insert(employeeEmergencyData),
            qb(TABLE.customDetails).insert(employeeCustomData)
        )
    };

    /**
     * UPDATE Queries ----------------------------------------------------------------------------------------
     */

}

