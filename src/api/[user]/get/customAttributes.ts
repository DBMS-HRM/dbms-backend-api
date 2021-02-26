import {EHandler, Handler} from "../../../utils/types";
import {inspectBuilder, query} from "../../../utils/inspect";
import model, {MErr} from "../../../model";


/**
 * :: STEP 2
 * Get All Posts
 */
const get_CustomAttributes: Handler = async (req, res) => {
    const {r} = res;

    const [{code}, admins] = await model.user.getAllAdmins(req.query);

    if (code === MErr.NO_ERROR) {
        r.status.OK()
            .message("Success")
            .data(admins)
            .send();
        return;
    }

    r.pb.ISE().send();
};

/**
 * Validation chain
 */



export default [ get_CustomAttributes as EHandler];