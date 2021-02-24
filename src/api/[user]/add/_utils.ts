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
        branchName : req.body.branch_name,
        accountType : req.body.accountType,
    }
}

export function extract_employeeAccountData(req : any){
    return{
        username : req.body.username,
        password : req.body.password,
        emailAddress : req.body.email,
        accountType : req.body.accountType,
    }
}

export function extract_employeeCompanyData(req : any){
    return{
        branchName : req.body.branchId,
        jobTitle : req.body.jobTitle,        
        employmentStatus : req.body.employmentStatus,
        payGrade : req.body.payGrade,
        departmentName : req.body.departmentName,
    }
}

export function extract_employeeEmergencyData(req : any){
    return{
        country : req.body.phoneNumber,
        district : req.body.address,        
        city : req.body.emailAddress,
        street1 : req.body.emailAddress,
        street2 : req.body.emailAddress,
    }
}

export function extract_employeePersonalData(req : any){
    return{
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        dateOfBirth : req.body.dateOfBirth,
        maritalStatus : req.body.maritalStatus,
        
    }
}

export function extract_phoneNumber(req : any){
    return{
        phoneNumber : req.body.phoneNumber,
        
    }
}

export function extract_employeeCustomData(req : any){
    return{
        
        
    }
}