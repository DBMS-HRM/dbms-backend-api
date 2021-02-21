import {Router} from "express";

const rUser = Router();

rUser.get('/details')

// User Login
rUser.post('/login/admin')
rUser.post('/login/employee')

export default rUser