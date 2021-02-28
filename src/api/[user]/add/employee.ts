import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model";
import {extract_employeeAccountData, extract_employeeCompanyData,
    extract_employeeEmergencyData, extract_employeePersonalData,
    extract_employeeCustomData, extract_phoneNumber ,
} from "./_utils";
import {employeeAccount_inspector, employeePersonalData_inspector,
    employeeCompanyData_inspector, employeeEmergencyData_inspector,
    employeeCustomData_inspector, phoneNumber_inspector,
    admin_EmployeeAccountType_inspector, managerialEmployee_EmployeeAccountType_inspector
} from "./_inspectors";
import { v4 as UUID } from 'uuid';
import {inspectBuilder, body} from "../../../utils/inspect";

/**
 * Add employee
 * @param req
 * @param res
 * @param next
 */
const add_Employee : Handler = async (req,res, next) => {
    const {r} = res;
    const userId = UUID();
    const employeeAccountData = {
        employeeId : userId,
        ...await extract_employeeAccountData(req),
        status : true,
    };

    const employeeCompanyData= {
        employeeId : userId,
        ...extract_employeeCompanyData(req)
    };

    const employeeEmergencyData= {
        employeeId : userId,
        ...extract_employeeEmergencyData(req)
    };

    const employeePersonalData= {
        employeeId : userId,
        ...extract_employeePersonalData(req)
    };

    const employeeCustomData= {
        employeeId : userId,
        ...extract_employeeCustomData(req)
    };
    const phoneNumbers = extract_phoneNumber(req);

    // ToDo: [{employeeId : phoneNumber},{employeeId : phoneNumber}]
    const phoneNumber = {
        employeeId : userId,
        ...extract_phoneNumber(req)
    }


    const [{code}] = await model.user.addEmployeeAccount(employeeAccountData, employeeCompanyData, employeeEmergencyData, employeePersonalData,phoneNumber, employeeCustomData);
    if(code === MErr.NO_ERROR){
        r.status.OK()
            .message("Employee user added successfully")
            .send()
        return
    }else if(code === MErr.DUPLICATE_ENTRY){
        r.status.BAD_REQ()
            .message("Username or email has been already taken")
            .send()
    }
    r.pb.ISE();
}

/**
 * Check allowed account Types before add
 * @param req
 * @param res
 * @param next
 */
const $check_HRManager: Handler = (req,res,next) => {
    const {r} = res;
    if(req.user.jobTitle === model.user.job_titles.HRManager){
        next();
        return
    }
    else{
        r.status.FORBIDDEN()
            .message("Only HR managers are allowed to add employee")
            .send()
    }
}

const add_employee = {
    admin_AddEmployee : [employeeAccount_inspector,admin_EmployeeAccountType_inspector,employeePersonalData_inspector, employeeCompanyData_inspector, employeeEmergencyData_inspector, employeeCustomData_inspector, phoneNumber_inspector, add_Employee as EHandler],
    managerialEmployee_AddEmployee : [$check_HRManager as EHandler,employeeAccount_inspector, managerialEmployee_EmployeeAccountType_inspector,employeePersonalData_inspector,employeeCompanyData_inspector, employeeEmergencyData_inspector, employeeCustomData_inspector, phoneNumber_inspector, add_Employee as EHandler],
}

export default add_employee;