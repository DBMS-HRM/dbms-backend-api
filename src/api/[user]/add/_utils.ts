/**
 * Exporting admin account data
 * @param req : Express Request
 */

export function extract_adminAccountData(req : any){
    return{
        username : req.body.username,
        password : req.body.password,
        email : req.body.email,
        branch : req.body.branch,
        accountType : req.body.accountType,
    }
}