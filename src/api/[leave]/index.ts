import {Router} from "express";
import auth from "../../utils/auth";

const rLeave = Router();

/**
 * Employee Add Leave
 */
import add_leave from './add/addLeave';
rLeave.post('/add-leave',auth.employee,add_leave);

/**
 * Supervisor approve leave
 */
import approve_leave from "./update/approveLeave";
rLeave.put('/approve-leave/:employeeId',auth.employee,approve_leave);


export default rLeave;

