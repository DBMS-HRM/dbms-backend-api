/**
 * Admin Account interface
 */

export interface AdminAccount {
    userId : string;
    username : string;
    password : string;
    email : string;
    status : boolean;
    branchName : string;
    accountType : string;
}

/**
 * Employee Account interfaces
 */
export interface EmployeeAccount {
    userId : string;
    username : string;
    password : string;
    emailAddress : string;
    accountType : string;
    status : boolean;
}

export interface EmployeeCompanyDetail {
    employeeId : string;
    branchName : string;
    jobTitle : string;
    employmentStatus : string;
    payGrade : string;
    departmentName : string
}

export interface EmployeeEmergencyDetail {
    employeeId : string;
    address : string;
    emailAddress : string;
}

export interface PhoneNumber {
    employeeId : string;
    phoneNumber : number;
}


export interface EmployeePersonalDetail {
    employeeId : string;
    firstName : string;
    lastName : string;
    dateOfBirth : typeof Date;
    maritalStatus : boolean;
}

/**
 * Employee related Types
 */
export interface Branch {
    branchId : string;
    branchName : string;
}

export interface Department{
    departmentName : string
}

export interface JobTitle {
    jobTitle : string
}

export interface EmploymentStatus {
    employmentStatus : string;
}

export interface PayGrade {
    payGrade : string;
    numOfLeaves : number,
}

/**
 * Leave related Types
 */


/**
 * Report related Types
 */