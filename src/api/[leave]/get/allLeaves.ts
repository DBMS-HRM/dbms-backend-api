import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model";
import {inspectBuilder,query} from "../../../utils/inspect";

/**
 * Validation
 */
const leaveRequest_inspector = inspectBuilder(
    query("leaveType").optional()
        .isIn([...Object.values(model.leave.leaveTypes)]).withMessage("Invalid leave type"),
    query("leaveStatus").optional()
        .isIn([...Object.values(model.leave.leaveRequestStates)]).withMessage("Invalid leave type"),
    query("fromDate").optional(),
    query("toDate").optional(),
)

const get_AllLeaves : Handler = async (req,res,next) => {
    const {r} = res;
    req.query.supervisorId = req.user.userId;

    const [{code}, leaves] = await model.leave.get_AllLeaves(req.query);
    if(code === MErr.NO_ERROR){
        r.status.OK()
            .message("Successful")
            .data(leaves)
            .send()
        return;
    }
    r.pb.ISE().send();

}

export default [leaveRequest_inspector, get_AllLeaves as EHandler];
