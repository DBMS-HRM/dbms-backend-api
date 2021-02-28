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

const get_AllLeavesCount : Handler = async (req,res,next) => {
    const {r} = res;
    const [{code}, leaves] = await model.leave.get_LeaveReport(req.query);
    if(code === MErr.NO_ERROR){
        r.status.OK()
            .message("Successful")
            .data(leaves)
            .send()
        return;
    }
    r.pb.ISE().send();

}


export default [inspector, get_AllLeavesCount as EHandler];

