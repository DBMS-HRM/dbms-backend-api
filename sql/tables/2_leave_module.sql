----Clean Schema--------------------------------------------------------------------------------------

DROP TABLE IF EXISTS leave_request_state;
DROP TABLE IF EXISTS leave_request;
DROP TABLE IF EXISTS leave_approval_supervisor;
DROP TABLE IF EXISTS leave_type;


-- ████████╗░█████╗░██████╗░██╗░░░░░███████╗░██████╗
-- ╚══██╔══╝██╔══██╗██╔══██╗██║░░░░░██╔════╝██╔════╝
-- ░░░██║░░░███████║██████╦╝██║░░░░░█████╗░░╚█████╗░
-- ░░░██║░░░██╔══██║██╔══██╗██║░░░░░██╔══╝░░░╚═══██╗
-- ░░░██║░░░██║░░██║██████╦╝███████╗███████╗██████╔╝
-- ░░░╚═╝░░░╚═╝░░╚═╝╚═════╝░╚══════╝╚══════╝╚═════╝░

CREATE TABLE leave_request_state (
    leave_state VARCHAR(20) PRIMARY KEY
);


CREATE TABLE leave_type (
    leave_type VARCHAR(20) PRIMARY KEY
);

-- Leave Tables --------------------------------------------------------------------------------------------------------

CREATE TABLE leave_request (
    leave_id UUID PRIMARY KEY,
    employee_id UUID NOT NULL,
    request_date DATE NOT NULL,
    leave_state VARCHAR(20) NOT NULL,
    leave_type VARCHAR(20) NOT NULL,
    approved_date DATE NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT,
    FOREIGN KEY (leave_state) REFERENCES leave_request_state(leave_state) ON DELETE RESTRICT,
    FOREIGN KEY (leave_type) REFERENCES leave_type(leave_type) ON DELETE RESTRICT
);

CREATE TABLE leave_approval_supervisor (
    leave_id UUID PRIMARY KEY,
    supervisor_id UUID NOT NULL,
    FOREIGN KEY (leave_id) REFERENCES leave_request(leave_id) ON DELETE RESTRICT,
    FOREIGN KEY (supervisor_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT
);