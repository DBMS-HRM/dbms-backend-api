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

    const [error, account] = await model.user.getEmployeeAccount(username);

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
        username : account.username,
        userId: account.employeeId,
        email: account.emailAddress,
        status: account.status,
        accountType : account.accountType,
    }

    // create token
    const accessToken = TokenMan.getAccessToken(payload);

    const [{code}, employee] = await model.user.getEmployeeCP(account.employeeId);
    if(code != MErr.NO_ERROR){
        r.pb.ISE().send();
        return;
    }

    const employeeData = {
        firstName : employee.firstName,
        lastName : employee.lastName,
        jobTitle : employee.jobTitle,
        branchName : employee.branchName,
        employmentStatus : employee.employmentStatus,
        payGrade : employee.payGrade,
        departmentName : employee.departmentName,
    }
    r.status.OK()
        .data({...payload,...employeeData})
        .token(accessToken)
        .message("Success")
        .send();
};

/**
 * Request Handler Chain
 */
export default [inspector, <EHandler>validateCredentials, <EHandler>serveToken]