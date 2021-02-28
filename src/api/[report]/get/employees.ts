import {EHandler, Handler} from "../../../utils/types";
import {inspectBuilder, query} from "../../../utils/inspect";
import model, {MErr} from "../../../model";

/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
    query("employeeId").optional().isUUID().withMessage("Invalid employee id"),
    query("supervisorId").optional().isUUID().withMessage("Invalid supervisor id status"),
    query("payGrade").optional().isString().withMessage("Invalid pay grade")
        .isIn([Object.values(model.user.pay_grade)]).withMessage("Invalid pay grade"),
    query("departmentName").optional().isString().withMessage("Invalid department name"),
    query("jobTitle").optional().isString().withMessage("Invalid job title")
        .isIn([Object.values(model.user.job_titles)]).withMessage("Invalid pay grade"),
    query("employmentStatus").optional().isString().withMessage("Invalid employment status")
        .isIn([Object.values(model.user.employment_status)]).withMessage("Invalid pay grade")
);

/**
 * :: STEP 2
 * Get All Posts
 */
const get_Employees: Handler = async (req, res) => {
    const {r} = res;

    const [{code}, users] = await model.user.getEmployeeFullReport(req.query);

    if (code === MErr.NO_ERROR) {
        r.status.OK()
            .message("Success")
            .data(users)
            .send();
        return;
    }

    r.pb.ISE().send();
};


/**
 * Validation chain
 */


export default [inspector, get_Employees as EHandler];