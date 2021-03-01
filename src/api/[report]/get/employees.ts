import {EHandler, Handler} from "../../../utils/types";
import {inspectBuilder, query} from "../../../utils/inspect";
import model, {MErr} from "../../../model";
import {MError} from "../../../utils/db";

/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
    query("heading").optional().isString().withMessage("Invalid heading"),
);

/**
 * :: STEP 2
 * Get All Posts
 */
const get_EmployeeReport: Handler = async (req, res) => {
    const {r} = res;
    const branchName = req.user.branchName;
    let code = MErr.UNKNOWN ; let report;
    console.log(req.query.heading);
    switch (req.query.heading){
        case model.report.default_group_by.departmentName:
            const [err1, res1] = await model.report.reportGroupByDepartmentName(branchName);
            code = err1.code; report = res1;
            break;
        case model.report.default_group_by.payGrade:
            // code block
            break;
        case model.report.default_group_by.jobTitle:
            // code block
            break;
        default :
    }

    if (code === MErr.NO_ERROR) {
        r.status.OK()
            .message("Success")
            .data(report)
            .send();
        return;
    }
    r.pb.ISE().send();
};


/**
 * Validation chain
 */

const get_employee_reports = {
    defaultHeadings : [inspector, get_EmployeeReport as EHandler],
}

export default get_employee_reports;

