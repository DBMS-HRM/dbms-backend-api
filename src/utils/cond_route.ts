import {EHandler, Handler} from "./types";
import {Result, ValidationChain, validationResult} from "express-validator";

function condRoute(validator: ValidationChain, ifTrue: Handler, ifFalse: Handler): EHandler {
    const conditional_routing: Handler = (req, res, next) => {
        const clone = {...req}
        validator(req, res, () => {})
        const errors: Result = validationResult(clone)
        if (errors.isEmpty()) {
            ifTrue(req, res, next)
        } else {
            ifTrue(req, res, next);
        }
    }
    return <EHandler>conditional_routing
}

