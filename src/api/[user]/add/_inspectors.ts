import {inspectBuilder, body} from "../../../utils/inspect";

/**
 * Add Admin account inspector
 */
export const adminAccount_inspector = inspectBuilder(
    body("username").exists().withMessage("User name is required"),
    body("password").exists().withMessage("Password is required")
        .isLength({min : 6}).withMessage("Password should be more than 6 characters"),
    body("email").exists().withMessage("Email is required")
        .isEmail().withMessage("Email should be a valid email address"),
    body("branch_name").exists().withMessage("Branch Name is required"),
    body("accountType").optional(),

)

/**
 * Add Employee account inspector
 */

export const employeeAccount_inspector = inspectBuilder(
    body("username").exists().withMessage("User name is required"),
    body("password").exists().withMessage("Password is required")
        .isLength({min : 6}).withMessage("Password should be more than 6 characters"),
    body("email").exists().withMessage("Email is required")
        .isEmail().withMessage("Email should be a valid email address"),    
    body("accountType").optional(),

)

/**
 * Add Employee company details inspector
 */

export const employeeCompanyData_inspector = inspectBuilder(
    body("employeeId").exists().withMessage("Employee Id is required"),
    body("branchId").exists().withMessage("Branch Id is required"),        
    body("jobTitle").optional(),
    body("employmentStatus").optional(),
    body("payGrade").optional(),
    body("departmentName").exists().withMessage("Department name is required"),

)

/**
 * Add Employee emergency details inspector
 */

export const employeeEmergencyData_inspector = inspectBuilder(
    body("employeeId").exists().withMessage("Employee Id is required"),
    body("phoneNumber").exists().withMessage("Phone number is required"),        
    body("address").exists().withMessage("address is required"),
    body("emailAddress").exists().withMessage("Email address is required")
        .isEmail().withMessage("Email address should be a valid email address"),

)

/**
 * Add Employee personal details inspector
 */

export const employeePersonalData_inspector = inspectBuilder(
    body("employeeId").exists().withMessage("Employee Id is required"),
    body("name").exists().withMessage("Name is required"),                
    body("dateOfBirth").exists().withMessage("Date of birth is required")
        .isDate().withMessage("Date of birth should be a valid date"),
    body("maritalStatus").exists().withMessage("Marital status is required")
        .isBoolean().withMessage("Marital status should be a boolean"),

)

/**
 * Add Employee custom details inspector
 */

export const employeeCustomData_inspector = inspectBuilder(
    

)