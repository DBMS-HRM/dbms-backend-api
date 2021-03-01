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
        branchName : req.body.branchName,
        accountType : req.body.accountType,
    }
}

export async function extract_employeeAccountData(req : any){
    return{
        username : req.body.username,
        password :  await encrypt_password(req.body.password),
        emailAddress : req.body.emailAddress,
        accountType : req.body.accountType,
    }
}

export function extract_employeeCompanyData(req : any){
    return{
        branchName : req.body.branchName,
        jobTitle : req.body.jobTitle,        
        employmentStatus : req.body.employmentStatus,
        payGrade : req.body.payGrade,
        departmentName : req.body.departmentName,
        supervisorId : req.body.supervisorId,
    }
}

export function extract_employeeEmergencyData(req : any){
    return{
        country : req.body.country,
        district : req.body.district,
        city : req.body.city,
        street_1 : req.body.street1,
        street_2 : req.body.street2,
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
        phoneNumbers : req.body.phoneNumbers,
        
    }
}

export function extract_employeeCustomData(req : any){
    return{
        
        
    }
}