import {inspectBuilder, body} from "../../../utils/inspect";
import model from "../../../model";


/**
 * Update User company details inspector
 */

export const employeeCompanyData_inspector = inspectBuilder(
    body("branchName").optional().isString().withMessage("Branch Name should ba valid"),
    body("jobTitle").optional()
        .if((value :string,{req} :any) => req.body.accountType === model.user.user_account_types.managerialEmployee)
        .isIn([model.user.job_titles.HRManager]).withMessage("Job title is not valid"),
    body("employmentStatus").optional()
        .isIn([...Object.values(model.user.employment_status)]).withMessage("Employment status is not valid"),
    body("payGrade").optional()
        .isIn([...Object.values(model.user.pay_grade)]).withMessage("Pay grade is not valid"),
    body("departmentName").optional(),

)

/**
 * Add User emergency details inspector
 */

export const employeeEmergencyData_inspector = inspectBuilder(
    body("country").optional().isString().withMessage("Country is not valid"),
    body("district").optional().isString().withMessage("district is not valid"),
    body("city").optional().isString().withMessage("city is not valid"),
    body("street1").optional().isString().withMessage("street1 is not valid"),
    body("street2").optional().isString().withMessage("Street 2 is not valid")

)

/**
 * Add User personal details inspector
 */

export const employeePersonalData_inspector = inspectBuilder(
    body("firstName").optional(),
    body("lastName").optional(),
    body("dateOfBirth").optional()
        .isDate().withMessage("Date of birth should be a valid date"),
    body("maritalStatus").optional()
        .isBoolean().withMessage("Marital status should be a boolean"),
)


/**
 * Add User custom details inspector
 */

export const employeeCustomData_inspector = inspectBuilder(

)

/**
 * Add User phone number details inspector
 */

export const phoneNumber_inspector = inspectBuilder(
    body("phoneNumbers").optional().isArray().withMessage("Phone number is not valid")
)