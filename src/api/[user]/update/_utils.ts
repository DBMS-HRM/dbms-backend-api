import {encrypt_password} from "../../../utils/hasher";

/**
 * Exporting admin account data
 * @param req : Express Request
 */

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
        country : req.body.phoneNumber,
        district : req.body.district,
        city : req.body.city,
        street_1 : req.body.street_1,
        street_2 : req.body.street_2,
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
        customData: req.body.customData
    }
}