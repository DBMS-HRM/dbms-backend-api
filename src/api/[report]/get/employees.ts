import {EHandler, Handler} from "../../../utils/types";
import {inspectBuilder, query} from "../../../utils/inspect";
import model, {MErr} from "../../../model";
import {toSnakeCase} from "../../../utils/db/typo";

/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
    query("heading").exists().isString().withMessage("Invalid heading"),
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
            const [err2, res2] = await model.report.reportGroupByPayGrade(branchName);
            code = err2.code; report = res2;
            break;
        case model.report.default_group_by.jobTitle:
            const [err3, res3] = await model.report.reportGroupByJobTitle(branchName);
            code = err3.code; report = res3;
            break;
        case model.report.default_group_by.employmentStatus:
            const [err4, res4] = await model.report.reportGroupByEmploymentStatus(branchName);
            code = err4.code; report = res4;
            break;
        default :
            // @ts-ignore
            const [err5, res5] = await model.report.reportGroupByCustomAttributes(branchName, toSnakeCase(req.query.heading));
            code = err5.code; report = res5;
            break;
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

