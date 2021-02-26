import {EHandler, Handler} from "../../../utils/types";
import {inspectBuilder, query} from "../../../utils/inspect";
import model, {MErr} from "../../../model";

/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
    query("userId").optional().isUUID().withMessage("Invalid employee id"),
    query("email").optional().isEmail().withMessage("Invalid email"),
    query("branchName").optional().isString().withMessage("Invalid branch Name")
        .isIn(Object.values(model.user.branch_names)).withMessage("Not a valid branch"),
    query("username").optional().isString().withMessage("Invalid username"),
);

/**
 * :: STEP 2
 * Get All Posts
 */
const get_Admins: Handler = async (req, res) => {
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



export default [inspector, get_Admins as EHandler];