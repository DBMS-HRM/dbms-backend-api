import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model";
import {inspectBuilder,param} from "../../../utils/inspect";

const inspector = inspectBuilder(
    param("employeeId").exists().withMessage("Employee Id is required")
        .isUUID().withMessage("Employee Id is not valid")
)

const get_LeaveConfigs : Handler = async (req,res,next) => {
    const {r} = res;
    const employeeId = req.params.employeeId;
    const [{code}, leaveConfigs] = await model.leave.getRemainingLeaves(employeeId);
    if(code === MErr.NO_ERROR){
        r.status.OK()
            .message("Successful")
            .data(leaveConfigs)
            .send()
        return;
    }
    r.pb.ISE().send();

}

/**
 * Handler chain
 */

const $set_employeeId : Handler = (req,res,next) => {
    req.params.employeeId = req.user.userId;
    next();
}



const get_remaining_leaves = {
    my_RemainingLeaves : [ $set_employeeId as EHandler,get_LeaveConfigs as EHandler],
    employee_RemainingLeaves : [ inspector,get_LeaveConfigs as EHandler],
}
export default get_remaining_leaves;
