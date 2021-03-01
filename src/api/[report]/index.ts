import {Router} from "express";
import auth from "../../utils/auth";

const rReport = Router();


/**
 * Get reports
 */
import get_leaves from "./get/leaves";

rReport.get('/get-leaves',auth.managerialEmployee,get_leaves )


/**
 * Get employee reports
 */
import get_employee_reports from "./get/employees";
rReport.get('/get-employees',auth.managerialEmployee,get_employee_reports.defaultHeadings )

export default rReport;


