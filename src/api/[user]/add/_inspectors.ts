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
    body("branchName").exists().withMessage("Branch Name is required"),
    body("accountType").optional(),

)

/**
 * Add Employee account inspector
 */

export const employeeAccount_inspector = inspectBuilder(
    body("username").exists().withMessage("User name is required"),
    body("password").exists().withMessage("Password is required")
        .isLength({min : 6}).withMessage("Password should be more than 6 characters"),
    body("emailAddress").exists().withMessage("Email is required")
        .isEmail().withMessage("Email should be a valid email address"),    
    body("accountType").optional(),

)

/**
 * Add Employee company details inspector
 */

export const employeeCompanyData_inspector = inspectBuilder(
    body("branchName").exists().withMessage("Branch Id is required"),
    body("jobTitle").exists().withMessage("Branch Id is required"),
    body("employmentStatus").exists().withMessage("Branch Id is required"),
    body("payGrade").exists().withMessage("Branch Id is required"),
    body("departmentName").exists().withMessage("Department name is required"),

)

/**
 * Add Employee emergency details inspector
 */

export const employeeEmergencyData_inspector = inspectBuilder(
    body("country").exists().withMessage("Country is required"),
    body("district").exists().withMessage("district is required"),
    body("city").exists().withMessage("city is required"),
    body("street1").exists().withMessage("street is required"),
    body("steet2").optional(),

)

/**
 * Add Employee personal details inspector
 */

export const employeePersonalData_inspector = inspectBuilder(
    body("firstName").exists().withMessage("First name is required"),
    body("lastName").exists().withMessage("Last name is required"),                
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

/**
 * Add Employee phone number details inspector
 */

export const phoneNumber_inspector = inspectBuilder(
    body("phoneNumber").exists().withMessage("Phone Number is required"),
)