import {encrypt_password} from "../../../utils/hasher";
/**
 * Exporting admin account data
 * @param req : Express Request
 */

export async function extract_adminAccountData(req : any){
    return{
        username : req.body.username,
        password : await encrypt_password(req.body.password),
        email : req.body.email,
        branch_name : req.body.branch_name,
        accountType : req.body.accountType,
    }
}