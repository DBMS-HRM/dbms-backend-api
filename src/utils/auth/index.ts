import {EHandler, Handler} from "../types";
import {TokenMan} from "../tokenMan";
import {inspectBuilder, header} from "../inspect";
import model, {MErr} from "../../model";

/**
 * :: STEP 1
 */
const inspectAuthHeader = inspectBuilder(
    header("authorization")
        .customSanitizer((value) => value.split(" ")[1])
        .exists().withMessage("authorization token is required")
        .isJWT().withMessage("authorization token format is invalid")
)

/**
 * :: STEP 2
 * @param req
 * @param res
 * @param next
 */
const parsePayload: Handler = (req, res, next) => {
    const {r} = res;

    const token = req.headers["authorization"]!.split(" ")[1];

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
// @ts-ignore
type AdminAccountType = model.user.admin_account_types.superAdmin | model.user.admin_account_types.admin
// @ts-ignore
type UserAccountType = model.user.user_account_types.employee | model.user.user_account_types.managerialEmployee | model.user.user_account_types.supervisor
function buildUserFilter(
    ...accountTypes: (AdminAccountType | UserAccountType)[]
): EHandler {
    const handler: Handler = (req, res, next) => {
        const { r } = res

        // @ts-ignore
        if (accountTypes.includes(req.user.accountType)) {
            next();
            return;
        }

        r.status
            .UN_AUTH()
            .message(`Only ${accountTypes.toString()} are allowed to access`)
            .send()
    }
    return handler as EHandler
}


/**
 * Request Handler Chain
 */
export default {
    employee: [inspectAuthHeader, parsePayload as EHandler, buildUserFilter(model.user.user_account_types.employee) as EHandler],
    managerialEmployee: [inspectAuthHeader, parsePayload as EHandler, buildUserFilter(model.user.user_account_types.managerialEmployee) as EHandler],
    supervisor: [inspectAuthHeader, parsePayload as EHandler, buildUserFilter(model.user.user_account_types.supervisor) as EHandler],
    superAdmin: [inspectAuthHeader, parsePayload as EHandler, buildUserFilter(model.user.admin_account_types.superAdmin,model.user.admin_account_types.admin) as EHandler],
    admin: [inspectAuthHeader, parsePayload as EHandler, buildUserFilter(model.user.admin_account_types.admin) as EHandler]
}