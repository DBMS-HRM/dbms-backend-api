import {Router} from "express";
import auth from "../../utils/auth";

const rLeave = Router();
/**
 * Query data
 */
import get_leaves from "./get/allLeaves";
rLeave.get('/get-all',auth.supervisor,get_leaves.getAllLeaves);
rLeave.get('/get-my-all',auth.employee,get_leaves.employeeMyLeaves);

/**
 * Remaining leaves
 */
import get_remaining_leaves from "./get/remainingLeaves";
rLeave.get('/get-remaining-leaves/:employeeId', auth.supervisor, get_remaining_leaves.employee_RemainingLeaves);
rLeave.get('/get-remaining-leaves', auth.employee, get_remaining_leaves.my_RemainingLeaves);

/**
 * User Add Leave
 */
import add_leave from './add/addLeave';
rLeave.post('/add-leave',auth.employee,add_leave);

/**
 * Supervisor approve leave
 */
import change_leave from "./update/leaveStatus";
rLeave.put('/change-leave-status/:leaveId',auth.supervisor,change_leave);

/**
 * Config leaves
 */
import config_leaves from "./update/configLeaves";
import get_leave_configs from "./get/leaveConfigs";
rLeave.put('/config-leaves',auth.admin,config_leaves);
rLeave.get('/config-leaves',auth.admin,get_leave_configs);

export default rLeave;

