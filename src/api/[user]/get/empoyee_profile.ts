import {EHandler, Handler} from "../../../utils/types";
import {inspectBuilder, query} from "../../../utils/inspect";
import model, {MErr} from "../../../model";

/**
 * Get all employee profile
 * @param req
 * @param res
 */
const get_EmployeeProfile: Handler = async (req, res,next) => {
    const {r} = res;
    const employeeId = req.params.employeeId;

    const [{code}, user] = await model.user.getEmployeeFullDetail(employeeId)
    delete user['password'];
    if(code === MErr.NO_ERROR){
        r.status.OK()
            .message("Successful")
            .data(user)
            .send()
        return;
    }else if(code === MErr.NOT_FOUND){
        r.status.BAD_REQ()
            .message("User not found")
            .send()
        return;
    }

    r.pb.ISE().send();
};

const set_employeeId = (req,res,next) => {
    req.params.employeeId = req.user.userId;
    next();
    return;
}

const viewProfile = {
    employeeViewProfile : [set_employeeId, get_EmployeeProfile as EHandler],
    managerViewProfile : [ get_EmployeeProfile as EHandler],
}

export default viewProfile;
