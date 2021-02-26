import {EHandler, Handler} from "../../../utils/types";
import {inspectBuilder, body} from "../../../utils/inspect";
import model, {MErr} from "../../../model";

/**
 * Validations
 */
const inspector = inspectBuilder(
    body("attributeName").exists().withMessage("Attribute name is required"),
    body("type").exists().withMessage("Attribute type is required"),
    body("defaultValue").exists().withMessage("Default value is required"),
)

/**
 * :: STEP 2
 * Get All Posts
 */
const update_CustomAttributes: Handler = async (req, res) => {
    const {r} = res;

    // const [{code}] = await model.user.(req.query);

    // if (code === MErr.NO_ERROR) {
    //     r.status.OK()
    //         .message("Success")
    //         .send();
    //     return;
    // }

    r.pb.ISE().send();
};

/**
 * Validation chain
 */



export default [ inspector,update_CustomAttributes as EHandler];