import {Router} from "express";
import admin from "./login/admin";
import auth from "../../utils/auth";

const rUser = Router();


// User Login
rUser.post('/login/admin', admin)
rUser.post('/login/employee')

/**
 * Register Users
 */
import register_admin from "./add/admin";
import add_employee from "./add/employee"
rUser.post('/register/admin',auth.superAdmin,register_admin );
rUser.post('/register/managerial-employee',auth.admin,add_employee.admin_AddEmployee );
rUser.post('/register/employee',auth.managerialEmployee,add_employee.managerialEmployee_AddEmployee);

export default rUser