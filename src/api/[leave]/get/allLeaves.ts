import { EHandler, Handler } from "../../../utils/types";
import model, { MErr } from "../../../model";
import { inspectBuilder, query } from "../../../utils/inspect";

/**
 * Validation
 */
const leaveRequest_inspector = inspectBuilder(
  query("leaveType")
    .optional()
    .isIn([...Object.values(model.leave.leaveTypes)])
    .withMessage("Invalid leave type"),
  query("leaveStatus")
    .optional()
    .isIn([...Object.values(model.leave.leaveRequestStates)])
    .withMessage("Invalid leave type"),
  query("jobTitle")
      .optional()
      .isIn([...Object.values(model.user.job_titles)])
      .withMessage("Invalid leave type"),
  query("payGrade")
      .optional()
      .isIn([...Object.values(model.user.pay_grade)])
      .withMessage("Invalid leave type"),
  query("branchName")
      .optional()
      .isIn([...Object.values(model.user.branch_names)])
      .withMessage("Invalid leave type"),
    query("departmentName")
        .optional()
        .isIn([...Object.values(model.user.department_names)])
        .withMessage("Invalid leave type"),
  query("fromDate").optional(),
  query("toDate").optional(),
  query("reviewedDate").optional(),
  query("employeeId").optional().isUUID().withMessage("Employee id is not valid"),
  query("supervisorId").optional().isUUID().withMessage("Supervisor id is not valid"),
  query("leaveId").optional().isUUID().withMessage("Leave Id is not valid"),
);

const get_AllLeaves: Handler = async (req, res, next) => {
  const { r } = res;
  console.log(req.query);
  const [{ code }, leaves] = await model.leave.get_AllLeaves(req.query);
  if (code === MErr.NO_ERROR) {
    r.status.OK().message("Successful").data(leaves).send();
    return;
  }
  r.pb.ISE().send();
};

const $set_employeeId: Handler = (req, res, next) => {
  req.query.employeeId = req.user.userId;
  next();
};

const $set_supervisorId: Handler = (req, res, next) => {
  req.query.supervisorId = req.user.userId;
  next();
};

const get_leaves = {
  getAllLeaves: [leaveRequest_inspector, get_AllLeaves as EHandler],

  employeeMyLeaves: [
    $set_employeeId as EHandler,
    leaveRequest_inspector,
    get_AllLeaves as EHandler,
  ],

  supervisorLeaves: [
    $set_supervisorId as EHandler,
    leaveRequest_inspector,
    get_AllLeaves as EHandler,
  ],
};
export default get_leaves;
