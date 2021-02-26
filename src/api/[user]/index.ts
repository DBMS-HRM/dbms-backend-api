import {Router} from "express";
import admin from "./login/admin";
import employee from "./login/employee";
import auth from "../../utils/auth";

const rUser = Router();


/**
 * User login
 */
rUser.post('/login/admin', admin)
rUser.post('/login/employee', employee)

/**
 * Register Users
 */
import register_admin from "./add/admin";
import add_employee from "./add/employee"
rUser.post('/register/admin',auth.superAdmin,register_admin );
rUser.post('/register/managerial-employee',auth.admin,add_employee.admin_AddEmployee );
rUser.post('/register/employee',auth.managerialEmployee,add_employee.managerialEmployee_AddEmployee);

/**
 * Get employees
 */
import get_employee from "./get/all_employees";
import get_admin from "./get/all_admins";
rUser.get('/get-level3',auth.managerialEmployee,get_employee.get_level3 );
rUser.get('/get-employees',auth.managerialEmployee,get_employee.get_all );
rUser.get('/get-admins',auth.superAdmin,get_admin );


/**
 * Managerial Employee Routers
 */
import changeSupervisor from "./update/setSupervisor";
// Set supervisor
rUser.post('/set-supervisor',auth.managerialEmployee, changeSupervisor.setSupervisor);


/**
 * View Profile
 */
import view_profile from "./get/empoyee_profile";
rUser.get('/my-profile',auth.employee, view_profile.employeeViewProfile);
rUser.get('/view-profile/:employeeId',auth.managerialEmployee, view_profile.employeeViewProfile);


/**
 * Custom attributes
 */
import get_custom_attributes from "./get/customAttributes";
import update_custom_attributes from "./update/customAttributes";
rUser.get('/get-custom-attributes',auth.admin, get_custom_attributes);
rUser.put('/update-custom-attributes',auth.admin, update_custom_attributes);


export default rUser

