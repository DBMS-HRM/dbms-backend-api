import {Router} from "express";
import auth from "../../utils/auth";

const rLeave = Router();
/**
 * Query data
 */
import get_leaves from "./get/allLeaves";
rLeave.get('/get-all',auth.employee,get_leaves);

/**
 * Employee Add Leave
 */
import add_leave from './add/addLeave';
rLeave.post('/add-leave',auth.employee,add_leave);

/**
 * Supervisor approve leave
 */
import approve_leave from "./update/approveLeave";
rLeave.put('/approve-leave/:leaveId',auth.employee,approve_leave);

/**
 * Config leaves
 */
import config_leaves from "./update/configLeaves";
import get_leave_configs from "./get/leaveConfigs";
rLeave.put('/config-leaves',auth.admin,config_leaves);
rLeave.get('/config-leaves',auth.admin,get_leave_configs);

export default rLeave;

