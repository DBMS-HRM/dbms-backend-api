import {EHandler, Handler} from "../../../utils/types";
import model, {MErr} from "../../../model";
import {extract_employeeAccountData, extract_employeeCompanyData, extract_employeeEmergencyData, extract_employeePersonalData, extract_employeeCustomData} from "./_utils";
import {employeeAccount_inspector, employeeCompanyData_inspector, employeeEmergencyData_inspector, employeeCustomData_inspector} from "./_inspectors";
import { v4 as UUID } from 'uuid';

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
        userId,
        ...await extract_employeeAccountData(req),
        status : true,
    };

    const employeeCompanyData= {
        employeeId : userId,
        ...await extract_employeeCompanyData(req),
        status : true,
    };

    const employeeEmergencyData= {
        employeeId : userId,
        ...await extract_employeeEmergencyData(req),
        status : true,
    };

    const employeePersonalData= {
        employeeId : userId,
        ...await extract_employeePersonalData(req),
        status : true,
    };

    const employeeCustomData= {
        userId,
        ...await extract_employeeCustomData(req),
        status : true,
    };

    const phoneNumber = {
        employeeId : userId,
        "phoneNumber" : +9477453588,
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

const set_employeeAccountType : Handler = (req,res,next) => {
    if(req.body.accountType === undefined){
        req.body.accountType = model.user.user_account_types.employee;
        next();
        return;
    }
    next();
}

export default [employeeAccount_inspector, employeeCompanyData_inspector, employeeEmergencyData_inspector, employeeCustomData_inspector, set_employeeAccountType as EHandler, add_Employee as EHandler];