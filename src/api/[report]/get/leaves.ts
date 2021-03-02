import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model";
import {inspectBuilder,query} from "../../../utils/inspect";

/**
 * Validation
 */
const inspector = inspectBuilder(
    query("fromDate").optional(),
    query("toDate").optional()
)

const converter = (leaveCounts : any, leaveType : typeof model.leave.leaveTypes[keyof typeof model.leave.leaveTypes]) => {
    const count =  leaveCounts.filter((v: any) => Object.keys(v)[0] === leaveType)[0];
    return count&&count[leaveType];
}

const get_AllLeavesCount : Handler = async (req,res,next) => {
    const {r} = res;
    console.log(req.query);
    const [{code}, leaves] = await model.leave.get_LeaveReport(req.query);
    leaves.forEach((value : any, index) => {
        const leaveCounts = value.leaveCount;
        value.casual =  converter(leaveCounts, model.leave.leaveTypes.casual) || 0;
        value.anual = converter(leaveCounts, model.leave.leaveTypes.annual) || 0;
        value.maternity = converter(leaveCounts, model.leave.leaveTypes.maternity) || 0;
        value.noPay = converter(leaveCounts, model.leave.leaveTypes.noPay) || 0;
        delete value.leaveCount;
    })


    if(code === MErr.NO_ERROR){
        r.status.OK()
            .message("Successful")
            .data(leaves)
            .send()
        return;
    }
    r.pb.ISE().send();

}

const $set_branchName : Handler = (req,res,next) => {
    req.query.branchName = req.user.branchName;
    next();
}

export default [inspector,$set_branchName as EHandler, get_AllLeavesCount as EHandler];

