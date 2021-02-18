import {runTrx, runQuery, MErr, qb} from "../utils/db";

const TABLE = {
    employeeAccount : "employeeAccount",
    adminAccount : "adminAccount",
    employeeCompanyDetail: "employeeCompanyDetail",
    employeePersonalDetail : "employeePersonalDetail",
    employeeEmergencyDetail : "employeeEmergencyDetail",
    jobTitle : "jobTitle",
    employmentStatus : "employmentStatus",
    branch :  "branch",
    department : "department",
    payGrade : "payGrade",
}

interface EmployeeAccount {
    userId : string;
    username : string;
    password : string;
    email : string;
    accountType : string;
}

interface AdminAccount {
    userId : string;
    username : string;
    password : string;
    email : string;
    accountType : string;
}

interface EmployeeCompanyDetail {
    employeeId : string;
    branchId : string;
    jobTitle : string;
    employmentStatus : string;
    payGrade : string;
    departmentName : string
}

interface Branch {
    branchId : string;
    branchName : string;
}

interface JobTitle {
    jobTitle : string
}

interface EmploymentStatus {
    employmentStatus : string;
}

interface Department{
    departmentName : string
}

interface PayGrade {
    payGrade : string;
    numOfLeaves : number,
}

export default abstract class Employee{
    static job_titles = {
        HRManager : "HR Manager",
        QAEngineer : "QA Engineer",
        Accountant : "Accountant",
        SoftwareEngineer : "Software Engineer"

    }

    static account_types = {
        admin : "admin",
        managerialEmployee : "managerialEmployee",
        supervisor : "supervisor",
    }

    static pay_grade = {
       level1 : "Level 1",
       level2 : "Level 2",
       level3 : "Level 3",
    }

    static employment_status = {
        interFullTime : "Intern Full Time",
        interPartTime : "Inter Part Time",
        contractFullTime : "Contract Full Time",
        contractPartTime : "Contract Part Time",
        permanent : "Permanent",
        freelance : "Freelance"
    };

    // Get employee by user name
    static getEmployeeAccount (username : string ) : Promise<[any, object]> {
        return runQuery(
            qb(TABLE.employeeAccount).where({username})
        );
    };

    // Get admin account by user name
    static getAdminAccount (username : string ) : Promise<[any, object]> {
        return runQuery(
            qb(TABLE.adminAccount).where({username}).limit(1)
        );
    };

    // Admin account
    static addAdminUser (adminAccountData : AdminAccount) {
        return runQuery(
            qb(TABLE.adminAccount).insert(adminAccountData)
        )
    }

    // Create employee account -> Not the complete data
    static addEmployeeAccount (employeeAccountData : EmployeeAccount){
        return runQuery(
            qb(TABLE.employeeAccount).insert(employeeAccountData)
        )
    };



}

