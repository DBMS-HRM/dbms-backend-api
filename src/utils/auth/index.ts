import {EHandler, Handler} from "../types";
import {TokenMan} from "../tokenMan";
import {inspectBuilder, header} from "../inspect";

/**
 * :: STEP 1
 */
const inspectAuthHeader = inspectBuilder(
    header("authorization")
        .isString().withMessage("Bearer authorization header is required")
        .customSanitizer((value) => {
            return (String(value) || "").split(" ")[1]
        })
        .isString().withMessage("authorization header is invalid")
        .isJWT().withMessage("authorization token is invalid")
)

/**
 * :: STEP 2
 * @param req
 * @param res
 * @param next
 */
const parsePayload: Handler = (req, res, next) => {
    const {r} = res;

    const token = req.headers["authorization"] || '';

    const payload = TokenMan.verifyAccessToken(token);
    if (!payload) {
        r.status.UN_AUTH()
            .data({expired: true})
            .message("Authentication token is invalid or expired")
            .send();
        return;
    }

    req.user = payload;
    next();
};

/**
 * :: STEP 3 Builder
 * @param userType
 */
function buildUserFilter(userType: "Regular" | "Administrator"): Handler {
    return (req, res, next) => {
        const {r} = res;

        if (req.user.userType === userType) {
            next();
            return;
        }

        r.status.UN_AUTH()
            .message(`Only ${userType} users are allowed to access`)
            .send()
    }
}


/**
 * Request Handler Chain
 */
export default {
    regular: [inspectAuthHeader, parsePayload as EHandler, buildUserFilter("Regular") as EHandler],
    admin: [inspectAuthHeader, parsePayload as EHandler, buildUserFilter("Administrator") as EHandler]
}