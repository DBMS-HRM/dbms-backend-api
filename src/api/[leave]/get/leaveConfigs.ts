import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model";


const get_LeaveConfigs : Handler = async (req,res,next) => {
    const {r} = res;

    const [{code}, leaveConfigs] = await model.leave.getLeaveConfig();
    if(code === MErr.NO_ERROR){
        r.status.OK()
            .message("Successful")
            .data(leaveConfigs)
            .send()
        return;
    }
    r.pb.ISE().send();

}

export default [ get_LeaveConfigs as EHandler];
