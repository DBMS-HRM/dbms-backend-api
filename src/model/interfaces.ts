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
 * User Account interfaces
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
    departmentName : string,
    supervisorId : string
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

export interface EmployeeLoginDetail {
    username : string,
    password : string,
    emailAddress : string,
    accountType : string,
    status : boolean,
    employeeId : string;
    branchName : string;
    jobTitle : string;
    employmentStatus : string;
    payGrade : string;
    departmentName : string,
    supervisorId : string,
    firstName : string,
    lastName : string,
    dateOfBirth : typeof Date,
    maritalStatus : boolean,
    isSupervisor : boolean
}

/**
 * Supervisor table
 */
export interface Supervisor {
    supervisorId : string;
    employeeId : string;
}


/**
 * User related Types
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
    annualLeaves : number;
    casualLeaves : number;
    maternityLeaves : number;
    nopayLeaves : number;
}

/**
 * Leave related Types
 */
export interface LeaveRequest {
    leaveId  : string;
    employeeId  : string;
    reviewedDate  : typeof Date;
    leaveStatus  : string;
    leaveType  : string;
    supervisorId : string;
    fromDate  : typeof Date;
    toDate  : typeof Date;

}

export interface SupervisorLeaveRequest {
    employeeId  : string;
    branchName : string;
    jobTitle : string;
    employmentStatus : string;
    payGrade : string;
    departmentName : string;
    supervisorId : string;
    firstName : string;
    lastName : string;
    maritalStatus : string;
    leaveId  : string;
    leaveStatus  : string;
    leaveType  : string;
    reviewedDate  : typeof Date;
    fromDate  : typeof Date;
    toDate  : typeof Date;

}

/**
 * Report related Types
 */


/**
 * Custom attributes
 */

export interface CustomColumn {
    customColumn : string,
    dataType : string,
    defaultValue : string
}

