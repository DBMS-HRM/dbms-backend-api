import {Router} from "express";
import admin from "./login/admin";

const rUser = Router();


// User Login
rUser.post('/login/admin', admin)
rUser.post('/login/employee')

export default rUser