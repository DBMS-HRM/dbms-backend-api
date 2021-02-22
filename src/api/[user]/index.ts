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
rUser.post('/register/admin',auth.superAdmin,register_admin );

export default rUser