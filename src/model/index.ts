import User from "./user";
import LeaveModel from "./leave";
import ReportModel from "./report";
export {MErr} from "../utils/db";

export default {
    user: User,
    leave : LeaveModel,
    report : ReportModel
}