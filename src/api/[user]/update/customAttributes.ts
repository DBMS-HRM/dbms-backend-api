import {EHandler, Handler} from "../../../utils/types";
import {inspectBuilder, body} from "../../../utils/inspect";
import model, {MErr} from "../../../model";

/**
 * Validations
 */
const update_inspector = inspectBuilder(
    body("attributeName").exists().withMessage("Attribute name is required"),
    body("type").exists().withMessage("Attribute type is required"),
    body("defaultValue").exists().withMessage("Default value is required"),
)

const delete_inspector = inspectBuilder(
    body("attributeName").exists().withMessage("Attribute name is required"),
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
 * Delete custom attributes
 * @param req
 * @param res
 */
const delete_CustomAttributes: Handler = async (req, res) => {
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

const custom_attributes = {
    update_attributes : [ update_inspector,update_CustomAttributes as EHandler],
    delete_attributes : [ delete_inspector,delete_CustomAttributes as EHandler],

}

export default custom_attributes;