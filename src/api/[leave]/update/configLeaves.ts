import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model";
import {inspectBuilder,body} from "../../../utils/inspect";

/**
 * Validation
 */
const inspector = inspectBuilder(
    body("payGrade").exists().withMessage("Pay Grade is required"),
    body("annualLeaves").optional().isInt().withMessage("Annual leaves should be a number"),
    body("casualLeaves").optional().isInt().withMessage("Casual leaves should be a number"),
    body("maternityLeaves").optional().isInt().withMessage("Maternity leaves should be a number"),
    body("nopayLeaves").optional().isInt().withMessage("No pay leaves Should be a number")
)

/**
 * Approve leae
 * @param req
 * @param res
 * @param next
 */
const configLeaves : Handler = async (req,res,next) => {
    const {r} = res;
    const leaveConfig = {
        payGrade : req.body.payGrade,
        annualLeaves : req.body.annualLeaves,
        casualLeaves : req.body.casualLeaves,
        maternityLeaves : req.body.maternityLeaves,
        nopayLeaves : req.body.nopayLeaves,
    }


    const [{code}] = await model.leave.updateLeaveConfig(leaveConfig);

    if(code === MErr.NO_ERROR){
        r.status.OK()
            .message("Leave configs changed")
            .send()
        return
    }else if(code === MErr.NOT_FOUND){
        r.status.OK()
            .message("Pay grade not found")
            .send()
        return;
    }
    r.pb.ISE();
}

export default [inspector, configLeaves as EHandler];

