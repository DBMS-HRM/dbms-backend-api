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
rApi.use('/user', rUser)

// Router
export default rApi