import {inspectBuilder, body} from "../../../utils/inspect";
import model from "../../../model";

/**
 * Add Admin account inspector
 */
export const adminAccount_inspector = inspectBuilder(
    body("username").exists().withMessage("User name is required"),
    body("password").exists().withMessage("Password is required")
        .isLength({min : 6}).withMessage("Password should be more than 6 characters"),
    body("email").exists().withMessage("Email is required")
        .isEmail().withMessage("Email should be a valid email address"),
    body("branchName").exists().withMessage("Branch Name is required")
        .isIn([...Object.values(model.user.branch_names)]).withMessage("Branch Name is not valid"),
    body("accountType").optional(),

)


/**
 * Add User account inspector
 */

export const employeeAccount_inspector = inspectBuilder(
    body("username").exists().withMessage("User name is required"),
    body("password").exists().withMessage("Password is required")
        .isLength({min : 6}).withMessage("Password should be more than 6 characters"),
    body("emailAddress").exists().withMessage("Email is required")
        .isEmail().withMessage("Email should be a valid email address"),    
    body("accountType").exists().withMessage("Account Type is required")

)

export const admin_EmployeeAccountType_inspector = inspectBuilder(
    body("accountType").isIn([model.user.user_account_types.managerialEmployee])
        .withMessage("Account type is invalid"),
    body("jobTitle").exists().withMessage("Branch Name is required")
        .isIn([model.user.job_titles.HRManager])
        .withMessage("Job title is not valid"),
)

export const managerialEmployee_EmployeeAccountType_inspector = inspectBuilder(
    body("accountType").isIn(Object.values(model.user.user_account_types )).withMessage("Account type is invalid"),
    body("jobTitle").exists().withMessage("Job title is required")
        .not()
        .isIn([model.user.job_titles.HRManager])
        .withMessage("Job title is not valid"),

)

/**
 * Add User company details inspector
 */

export const employeeCompanyData_inspector = inspectBuilder(
    body("branchName").exists().withMessage("Branch Id is required")
        .isIn([...Object.values(model.user.branch_names)]).withMessage("Branch Name is not valid")
        .custom((value : string, {req}) => {
            if(value != req.user.branchName){
                console.log(value, req.user.branchName);
                throw new Error('You can not add employee to other branches')
            }
            return true;
        }).withMessage("You can not add employee to different branch"),
    body("jobTitle").exists().withMessage("Branch Name is required")
        .if((value :string,{req} :any) =>
            req.body.accountType === model.user.user_account_types.managerialEmployee)
        .isIn([model.user.job_titles.HRManager])
        .withMessage("Job title is not valid"),
    body("employmentStatus").exists().withMessage("Employment status is required")
        .isIn([...Object.values(model.user.employment_status)])
        .withMessage("Employment status is not valid"),
    body("payGrade").exists().withMessage("Branch Id is required")
        .isIn([...Object.values(model.user.pay_grade)])
        .withMessage("Pay grade is not valid"),
    body("departmentName").exists().withMessage("Department name is required")
        .isIn([...Object.values(model.user.department_names)])
        .withMessage("Department Name is not valid"),
    body("supervisorId").optional().isUUID().withMessage("Supervisor id is not valid"),

)

/**
 * Add User emergency details inspector
 */

export const employeeEmergencyData_inspector = inspectBuilder(
    body("country").exists().withMessage("Country is required"),
    body("district").exists().withMessage("district is required"),
    body("city").exists().withMessage("city is required"),
    body("street_1").exists().withMessage("street is required"),
    body("street_2").optional(),

)

/**
 * Add User personal details inspector
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
 * Add User custom details inspector
 */

export const employeePhoneNumber_inspector = inspectBuilder(
    body("phoneNumbers").exists().withMessage("Mobile number is required")
)

/**
 * Add User custom details inspector
 */

export const employeeCustomData_inspector = inspectBuilder(
    
)
