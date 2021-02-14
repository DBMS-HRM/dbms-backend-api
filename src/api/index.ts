import {Router} from "express";
import cAbout from "./about";
import {rBuilder} from "../utils/resp";

export const rApi = Router();

// Specific middlewares for /api routes
rApi.use(rBuilder);

// Endpoints
rApi.get("/", cAbout);

// Router
export default rApi