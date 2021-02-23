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

export function extract_employeeAccountData(req : any){
    return{
        username : req.body.username,
        password : req.body.password,
        email : req.body.email,        
        accountType : req.body.accountType,
    }
}

export function extract_employeeCompanyData(req : any){
    return{
        employeeId : req.body.employeeId,
        branchId : req.body.branchId,
        jobTitle : req.body.jobTitle,        
        employmentStatus : req.body.employmentStatus,
        payGrade : req.body.payGrade,
        departmentName : req.body.departmentName,
    }
}

export function extract_employeeEmergencyData(req : any){
    return{
        employeeId : req.body.employeeId,
        phoneNumber : req.body.phoneNumber,
        address : req.body.address,        
        emailAddress : req.body.emailAddress,
        
    }
}

export function extract_employeePersonalData(req : any){
    return{
        employeeId : req.body.employeeId,
        name : req.body.namer,
        dateOfBirth : req.body.dateOfBirth,        
        maritalStatus : req.body.maritalStatus,
        
    }
}

export function extract_employeeCustomData(req : any){
    return{
        
        
    }
}