import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model";
import { v4 as UUID } from 'uuid';
import {inspectBuilder,body} from "../../../utils/inspect";

/**
 * Validation
 */
const leaveRequest_inspector = inspectBuilder(
    body("leaveType").exists().withMessage("Leave type is required")
        .isIn([...Object.values(model.leave.leaveTypes)]).withMessage("Invalid leave type")
)

const add_Leave : Handler = async (req,res,next) => {
    const {r} = res;

    const leaveRequestData = {
        leaveId : UUID(),
        employeeId : req.user.userId,
        requestDate : new Date(),
        leaveState : model.leave.leaveRequestStates.pending,
        leaveType : req.body.leaveType
    }
    console.log(leaveRequestData);
    const [{code}] = await model.leave.addLeave(leaveRequestData);

    if(code === MErr.NO_ERROR){
        r.status.OK()
            .message("Leave request is added successfully")
            .send()
        return
    }
    r.pb.ISE();
}

export default [leaveRequest_inspector, add_Leave as EHandler];
