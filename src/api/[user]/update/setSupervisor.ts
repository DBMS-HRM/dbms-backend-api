import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model";
// import {extract_adminAccountData} from "./_utils";
// import {adminAccount_inspector} from "./_inspectors";
import { v4 as UUID } from 'uuid';

/**
 * Add admin user
 * @param req
 * @param res
 * @param next
 */
const set_Supervisor : Handler = async (req,res, next) => {
    const {r} = res;

    // const [{code}] = await model.user.addAdminUser();
    // if(code === MErr.NO_ERROR){
    //     r.status.OK()
    //         .message("Admin user added successfully")
    //         .send()
    //     return
    // }else if(code === MErr.DUPLICATE_ENTRY){
    //     r.status.BAD_REQ()
    //         .message("Username or email has been already taken")
    //         .send()
    // }
    // r.pb.ISE();
}


// export default [adminAccount_inspector,set_adminAccountType as EHandler, add_AdminUser as EHandler];