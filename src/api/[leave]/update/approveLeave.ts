import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model";
import {inspectBuilder,param} from "../../../utils/inspect";
import {$check_Supervisor} from "../../[user]/handlers";

/**
 * Validation
 */
const inspector = inspectBuilder(
    param("leaveId").exists().withMessage("Leave id is required").isUUID(4).withMessage("Leave id is not valid")
)


/**
 * Approve leae
 * @param req
 * @param res
 * @param next
 */
const approve_Leave : Handler = async (req,res,next) => {
    const {r} = res;
    const leaveId = req.params.leaveId;
    const leaveApproveData = {
        supervisorId : req.user.userId,
        approvedDate : new Date(),
    }


    const [{code}] = await model.leave.approveLeave(leaveId,leaveApproveData);

    if(code === MErr.NO_ERROR){
        r.status.OK()
            .message("Leave request is approved")
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

export default [$check_Supervisor,inspector, approve_Leave as EHandler];

