import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model";

function toCamelCase(text: string) {
    return text.replace(/_([a-z])/g, (l1, l2) => `${l2.toUpperCase()}`);
}
/**
 * :: STEP 2
 * Get All Posts
 */
const get_CustomAttributes: Handler = async (req, res) => {
    const {r} = res;

    const [{code}, customColumns] = await model.user.getCustomAttributes();
    // @ts-ignore
    customColumns.forEach((value : any, index : any) => {
        value.customColumn = toCamelCase(value.customColumn);
    })

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
