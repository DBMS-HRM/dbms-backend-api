import {compare} from "bcrypt";
import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model"
import {inspectBuilder, body} from "../../../utils/inspect";
import {TokenMan} from "../../../utils/tokenMan";


/**
 * :: STEP 1
 * Validate Request
 */
const inspector = inspectBuilder(
    body("username").exists().withMessage("username is required"),
    body("password").exists().withMessage("password is required")
)

/**
 * :: STEP 2
 * Validate username + password
 */
const validateCredentials: Handler = async (req, res, next) => {
    const {r} = res;
    const {username, password} = req.body;

    const [error, account] = await model.user.getAdminAccount(username);

    if (error.code === MErr.NO_ERROR) {
        // password verification
        if (!await compare(password, account.password)) {
            r.status.UN_AUTH()
                .message("Incorrect username or password")
                .send();
            return;
        }

        req.body.account = account; // bind account data to request
        next() // send pair of tokens
        return;
    }

    if (error.code === MErr.NOT_FOUND) {
        r.status.NOT_FOUND()
            .message("User doesn't exists")
            .send();
        return;
    }

    r.pb.ISE().send();
};

/**
 * :: STEP 3
 * Serve JWT tokens
 */
const serveToken: Handler = async (req, res) => {
    const {r} = res;

    // creating payload model
    const account = req.body.account

    const payload = {
        userId: account.userId,
        email: account.email,
        status: account.status,
        accountType: account.accountType,
        branchName: account.branchName
    }

    // create token
    const accessToken = TokenMan.getAccessToken(payload);

    r.status.OK()
        .data(payload)
        .token(accessToken)
        .message("Success")
        .send();
};

/**
 * Request Handler Chain
 */
export default [inspector, <EHandler>validateCredentials, <EHandler>serveToken]

