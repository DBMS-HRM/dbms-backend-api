import {EHandler, Handler} from "../../../utils/types";
import {inspectBuilder, body} from "../../../utils/inspect";
import model, {MErr} from "../../../model";

/**
 * Validations
 */
const insert_inspector = inspectBuilder(
    body("customColumn").exists().withMessage("Custom column name is required"),
    body("dataType").exists().withMessage("Data type is required")
        .isIn(["TEXT","NUMBER"]).withMessage("Not a valid data type"),
    body("defaultValue").exists().withMessage("Default value is required"),
)

const delete_inspector = inspectBuilder(
    body("customColumn").exists().withMessage("Attribute name is required"),
)

/**
 * :: STEP 2
 * Get All Posts
 */
const insert_CustomColumn: Handler = async (req, res) => {
    const {r} = res;

    const customColumnData = {
        customColumn : req.body.customColumn,
        dataType : req.body.dataType,
        defaultValue : req.body.defaultValue
    }

    const [{code}] = await model.user.insertCustomAttributes(customColumnData);

    if (code === MErr.NO_ERROR) {
        r.status.OK()
            .message("Success")
            .send();
        return;
    }
    r.pb.ISE().send();
};

/**
 * Delete custom attributes
 * @param req
 * @param res
 */
const delete_CustomColumn: Handler = async (req, res) => {
    const {r} = res;

    const [{code}] = await model.user.deleteCustomAttributes(req.body.customColumn);

    if (code === MErr.NO_ERROR) {
        r.status.OK()
            .message("Success")
            .send();
        return;
    }
    r.pb.ISE().send();
};
/**
 * Validation chain
 */

const custom_attributes = {
    insert_attributes : [ insert_inspector,insert_CustomColumn as EHandler],
    delete_attributes : [ delete_inspector,delete_CustomColumn as EHandler],

}

export default custom_attributes;