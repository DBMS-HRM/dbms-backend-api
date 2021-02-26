import {Handler} from "../../utils/types";
import model, {MErr} from "../../model";

export const $check_Supervisor : Handler = async (req, res, next) => {
    const {r} = res;
    const [{code}, [data]] = await model.user.checkSupervisor(req.user.userId);
    if(code != MErr.NO_ERROR){
        r.pb.ISE().send()
        return;
    }
    if(!data.isSupervisor){
        r.status.FORBIDDEN()
            .message("Only supervisors are allowed")
            .send()
        return;
    }
    next();
    return;
}
