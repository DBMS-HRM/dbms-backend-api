import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model";
// import {extract_adminAccountData} from "./_utils";
// import {adminAccount_inspector} from "./_inspectors";
import { v4 as UUID } from 'uuid';
import {inspectBuilder,body} from "../../../utils/inspect";

/**
 * Validations
 */
const setSupervisor_inspector = inspectBuilder(
    body('supervisorId').exists().withMessage("Supervisor ID is required"),
    body('employeeId').exists().withMessage("User ID is required")
        .custom((value, {req}) => value != req.body.supervisorId).withMessage("Supervisor and employee can not be same")
)


/**
 * Add admin user
 * @param req
 * @param res
 * @param next
 */
const set_Supervisor : Handler = async (req,res, next) => {
    const {r} = res;
    const supervisorId = req.body.supervisorId;
    const employeeId = req.body.employeeId;
    const [{code}] = await model.user.setSupervisor(employeeId,supervisorId);
    if(code === MErr.NO_ERROR){
        r.status.OK()
            .message("Supervisor added successfully")
            .send()
        return
    }else if(code === MErr.DUPLICATE_ENTRY){
        r.status.BAD_REQ()
            .message("Supervisor and User already set")
            .send()
    }
    r.pb.ISE();
}


const changeSupervisor = {
    setSupervisor : [setSupervisor_inspector,set_Supervisor as EHandler],
}

export default changeSupervisor;