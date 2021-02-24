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
    employeeId : string;
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
    country : string;
    district : string;
    city : string;
    street_1 : string;
    street_2 : string;
    
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
 * Supervisor table
 */
export interface Supervisor {
    supervisorId : string;
    employeeId : string;
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
export interface LeaveRequest {
    leaveId  : string,
    employeeId  : string,
    requestDate  : typeof Date,
    leaveState  : string,
    leaveType  : string,
    approvedDate  : typeof Date,
    supervisorId : string
}

/**
 * Report related Types
 */