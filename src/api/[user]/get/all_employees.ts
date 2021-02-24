import {EHandler, Handler} from "../../../utils/types";
import {inspectBuilder, query} from "../../../utils/inspect";
import model, {MErr} from "../../../model";

/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
    query("employeeId").optional().isUUID().withMessage("Invalid post id"),
    query("userId").optional().isUUID().withMessage("Invalid user id"),
    query("status").optional().isString().withMessage("Invalid post status"),
);

/**
 * :: STEP 2
 * Get All Posts
 */
const getPost: Handler = async (req, res) => {
    const {r} = res;

    // Sync model to database
    const [{code}, posts] = //await model.post.get_Post(req.query)

    if (code === MErr.NO_ERROR) {
        r.status.OK()
            .message("Success")
            .data(posts)
            .send();
        return;
    }

    r.pb.ISE().send();
};
