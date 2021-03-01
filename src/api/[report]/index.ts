import {Router} from "express";
import auth from "../../utils/auth";

const rReport = Router();


/**
 * Get reports
 */
import get_leaves from "./get/leaves";
import get_employee from "./get/employees";
rReport.get('/get-leaves',auth.managerialEmployee,get_leaves )
rReport.get('/get-employees',auth.managerialEmployee,get_employee )

export default rReport;


