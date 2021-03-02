import {Router} from "express";
export const rMeta = Router();
import auth from "../../utils/auth"
import get_meta_data from "./get";

rMeta.get("/get-metadata",auth.all,get_meta_data);
