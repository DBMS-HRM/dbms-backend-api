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

export default rLeave;