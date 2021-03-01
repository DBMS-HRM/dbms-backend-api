import {EHandler, Handler} from "../../../utils/types";
import {inspectBuilder, body} from "../../../utils/inspect";
import model, {MErr} from "../../../model";
import {compare} from "bcrypt";
import {encrypt_password} from "../../../utils/hasher";

/**
 * Validation
 */
const password_inspector = inspectBuilder(
    body('currentPassword').exists().withMessage("Current password is required"),
    body('newPassword').exists().withMessage("New password is required"),
)

const forgot_password_inspector = inspectBuilder(
    body('newPassword').exists().withMessage("New password is required"),
)

/**
 * Change User Password
 *
 */
const update_PasswordEmployee: Handler = async (req, res) => {
    const {r} = res;
    const employeeId = req.params.userId;
    const newPassword = req.body.newPassword;

    const [{code}] = await model.user.changePasswordEmployee(
        employeeId,newPassword
    );

    if (code === MErr.NO_ERROR) {
        r.status.OK()
            .message("Success")
            .send();
        return;
    }
    r.pb.ISE().send();
};
/**
 * Change admin password
 * @param req
 * @param res
 */
const update_PasswordAdmin: Handler = async (req, res) => {
    const {r} = res;
    const userId = req.params.userId;
    const newPassword = req.body.newPassword;

    const [{code}] = await model.user.changePasswordAdmin(
        userId,newPassword
    );

    if (code === MErr.NO_ERROR) {
        r.status.OK()
            .message("Success")
            .send();
        return;
    }
    r.pb.ISE().send();
};

/**
 * Encrypt password
 */
const $encrypt_Password : Handler = async (req,res,next) => {
    req.body.newPassword = await encrypt_password(req.body.newPassword);
    next();
    return;
}


/**
 * Compare password
 */
const $compare_Password  = (password : string) : Handler => async (req,res,next) => {
    const {r} = res;
    console.log("New Password", req.body.newPassword);
    if (!await compare(req.body.newPassword, password)) {
        r.status.UN_AUTH()
            .message("Incorrect username or password")
            .send();
        return;
    }
    next() ;
    return;
}
// Check password of User
const $check_Password_Employee : Handler = async (req,res, next) => {
    const {r} = res;
    const [{code}, user] = await model.user.getEmployeeAccountByUserId(req.params.userId);
    if(code === MErr.NOT_FOUND){
        r.status.NOT_FOUND()
            .message("User not found")
    }else if(code === MErr.NO_ERROR){
        $compare_Password(user.password);
        next();
        return;
    }
    r.pb.ISE().send()
}

const $check_Password_Admin : Handler = async (req,res, next) => {
    const {r} = res;
    const [{code}, user] = await model.user.getAdminAccount(req.params.userId);
    if(code === MErr.NOT_FOUND){
        r.status.NOT_FOUND()
            .message("User not found")
    }else if(code === MErr.NO_ERROR){
        $compare_Password(user.password);
        next();
        return;
    }
    r.pb.ISE().send()
}

/**
 * Validation chain
 */
const $set_employeeId : Handler = (req,res, next) => {
    req.params.userId = req.user.userId;
    next();
    return;
}
const $set_adminId : Handler = (req,res, next) => {
    req.params.userId = req.user.userId;
    next();
    return;
}

const change_password = {
    changeEmployeeMyPassword : [ password_inspector,$set_employeeId as EHandler,
    $check_Password_Employee as EHandler, $encrypt_Password as EHandler, update_PasswordEmployee as EHandler],

    changeAdminMyPassword : [ password_inspector,$set_adminId as EHandler,
        $check_Password_Admin as EHandler,$encrypt_Password as EHandler, update_PasswordAdmin as EHandler],

    forgotEmployeePassword : [ forgot_password_inspector,$encrypt_Password as EHandler,
    update_PasswordEmployee as EHandler],

    forgotAdminPassword : [ forgot_password_inspector,$encrypt_Password as EHandler,
    update_PasswordAdmin as EHandler],
}

export default change_password;