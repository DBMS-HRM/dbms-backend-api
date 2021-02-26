import {Response as EResponse, Request as ERequest, NextFunction} from "express";
import {ResponseBuilder} from "./resp/res-builder";

export interface Request extends ERequest {
    user: {
        userId: string,
        accountType: "Admin" | "Super Admin" | "Employee" | "Managerial Employee" ,
        firstName: string,
        lastName: string,
        email: string,
        jobTitle : string,
        payGrade : string
    }
}

export interface Response extends EResponse {
    r: ResponseBuilder
}

export type Handler = (req: Request, res: Response, next: NextFunction) => void

export {Response as EResponse} from "express"
export {Request as ERequest} from "express"
export {Handler as EHandler} from "express"

export interface SocialAccountData {
    socialUserId: string,
    pictureUrl?: string,
    verified?: boolean,
    firstName: string
    lastName?: string
    email?: string
}