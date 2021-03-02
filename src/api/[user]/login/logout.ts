import {compare} from "bcrypt";
import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model"


const logout: Handler = async (req, res, next) => {
    const {r} = res;
    r.status.OK()
        .message("Successful logged out")
        .send()
}

/**
 * Request Handler Chain
 */
export default [logout as EHandler]