import {Router} from "express";
import cAbout from "./about";
import {rBuilder} from "../utils/resp";

export const rApi = Router();

// Specific middlewares for /api routes
rApi.use(rBuilder);

// Endpoints
rApi.get("/", cAbout);

// Sub routers
import rUser from "./[user]"
import rLeave from "./[leave]";
rApi.use('/user', rUser)
rApi.use('/leave', rLeave)

// Router
export default rApi