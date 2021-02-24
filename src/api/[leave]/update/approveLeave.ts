import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model";
import {inspectBuilder,param} from "../../../utils/inspect";

/**
 * Validation
 */
const inspector = inspectBuilder(
    param("employeeId").isUUID(4).withMessage("Employee id is not valid")
)


/**
 * Approve leae
 * @param req
 * @param res
 * @param next
 */
const approve_Leave : Handler = async (req,res,next) => {
    const {r} = res;
    const employeeId = req.params.employeeId;
    const leaveApproveData = {
        supervisorId : req.user.userId,
        approvedDate : new Date(),
    }


    const [{code}] = await model.leave.approveLeave(employeeId,leaveApproveData);

    if(code === MErr.NO_ERROR){
        r.status.OK()
            .message("Leave request is added successfully")
            .send()
        return
    }else if(code === MErr.NOT_FOUND){
        r.status.OK()
            .message("No employee found")
            .send()
        return
    }
    r.pb.ISE();
}

export default [inspector, approve_Leave as EHandler];

