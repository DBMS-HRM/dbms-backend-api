import {EHandler, Handler} from "../../../utils/types";
import {inspectBuilder, body} from "../../../utils/inspect";
import model, {MErr} from "../../../model";
import * as inspectors from "./_inspectors";
import * as reqData from "./_utils";

/**
 * Change phone numbers format
 * @param req
 */
const $returnPhoneArray = (req : any) => {
    if(req.body.phoneNumbers === undefined){
        return null;
    }
    console.log(req.body.phoneNumbers);
    const phoneNumbers = req.body.phoneNumbers;
    console.log(Object.values(phoneNumbers));
    let out = "{";
    phoneNumbers.forEach((mobile : any, index : number) => {
        out += Object.values(mobile) + ","
    })
    out.substring(0,phoneNumbers.length-1)
    out += "}"
    console.log(out);
    return out;
}

/**
 * :: STEP 2
 * Get All Posts
 */
const update_EmployeePersonalData: Handler = async (req, res) => {
    const {r} = res;
    const employeeId = req.user.userId;
    const phoneNumbers = $returnPhoneArray(req);
    console.log("Phone number", phoneNumbers);
    const [{code}] = await model.user.updateEmployeePersonalInfo(
        employeeId,reqData.extract_employeePersonalData(req),
        reqData.extract_employeeEmergencyData(req),
        phoneNumbers
    );

    if (code === MErr.NO_ERROR) {
        r.status.OK()
            .message("Success")
            .send();
        return;
    }

    r.pb.ISE().send();
};

const update_EmployeeFullData: Handler = async (req, res) => {
    const {r} = res;
    const employeeId = req.params.employeeId;
    const [{code}] = await model.user.updateEmployeeInfo(
        employeeId,
        reqData.extract_employeeCompanyData(req),
        reqData.extract_employeeEmergencyData(req),
        reqData.extract_employeePersonalData(req),
        reqData.extract_employeeCustomData(req),
        $returnPhoneArray(req)
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
 * Validation chain
 */

const employeePersonalData_inspectors = [
    inspectors.employeePersonalData_inspector,inspectors.employeeCompanyData_inspector,
    inspectors.employeeEmergencyData_inspector, inspectors.employeeCustomData_inspector,
    inspectors.phoneNumber_inspector
];

const update_employee_data = {
    personalData : [ inspectors.employeePersonalData_inspector,inspectors.employeeEmergencyData_inspector,update_EmployeePersonalData as EHandler],
    fullData : [ ...employeePersonalData_inspectors,update_EmployeeFullData as EHandler],
}

export default update_employee_data;