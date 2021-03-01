import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model";


/**
 * :: STEP 2
 * Get All Posts
 */
const get_CustomAttributes: Handler = async (req, res) => {
    const {r} = res;

    const [{code}, customColumns] = await model.user.getCustomAttributes();

    if (code === MErr.NO_ERROR) {
        r.status.OK()
            .message("Success")
            .data(customColumns)
            .send();
        return;
    }

    r.pb.ISE().send();
};

/**
 * Validation chain
 */


export default [ get_CustomAttributes as EHandler];
