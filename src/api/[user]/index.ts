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
rUser.get('/get-level3',auth.managerialEmployee,get_employee.get_level3 );
rUser.get('/get-all',auth.managerialEmployee,get_employee.get_all );


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
export default rUser