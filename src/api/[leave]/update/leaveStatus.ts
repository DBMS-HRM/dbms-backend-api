import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model";
import {inspectBuilder,param, body} from "../../../utils/inspect";
import {$check_Supervisor} from "../../[user]/handlers";

/**
 * Validation
 */
const inspector = inspectBuilder(
    param("leaveId").exists().withMessage("Leave id is required").isUUID(4).withMessage("Leave id is not valid"),
    body("leaveStatus").exists().withMessage("Leave status is required")
        .isIn([model.leave.leaveRequestStates.approved, model.leave.leaveRequestStates.rejected]).withMessage("Leave status is not valid")
)


/**
 * Approve leae
 * @param req
 * @param res
 * @param next
 */
const change_LeaveStatus : Handler = async (req,res,next) => {
    const {r} = res;
    const leaveId = req.params.leaveId;
    let leaveApproveData : any = {
        supervisorId : req.user.userId,
        reviewedDate : new Date()
    }
    if(req.body.leaveStatus === model.leave.leaveRequestStates.approved){
        leaveApproveData.leaveStatus = model.leave.leaveRequestStates.approved;
    }else if(req.body.leaveStatus === model.leave.leaveRequestStates.rejected){
        leaveApproveData.leaveStatus = model.leave.leaveRequestStates.rejected;
    }

    const [{code}] = await model.leave.changeLeaveStatus(leaveId,leaveApproveData);

    if(code === MErr.NO_ERROR){
        r.status.OK()
            .message("Leave request status is changed")
            .send()
        return
    }else if(code === MErr.NOT_FOUND){
        r.status.OK()
            .message("No employee found")
            .send()
        return
    }
    r.pb.ISE().send();
}

export default [$check_Supervisor as EHandler,inspector, change_LeaveStatus as EHandler];

