----Clean Schema--------------------------------------------------------------

DROP function IF EXISTS is_supervisor(uuid);
DROP TABLE IF EXISTS admin_account;
DROP TABLE IF EXISTS admin_account_type;

DROP TABLE IF EXISTS leave_approval_supervisor;
DROP TABLE IF EXISTS leave_request;
DROP TABLE IF EXISTS leave_request_state;
DROP TABLE IF EXISTS leave_type;

DROP TABLE IF EXISTS phone_number;
DROP TABLE IF EXISTS employee_personal_detail;
DROP TABLE IF EXISTS employee_emergency_detail;
DROP TABLE IF EXISTS employee_account;
DROP TABLE IF EXISTS custom_details;
DROP TABLE IF EXISTS supervisor;
DROP TABLE IF EXISTS employee_company_detail;
DROP TABLE IF EXISTS branch;


-- ████████╗░█████╗░██████╗░██╗░░░░░███████╗░██████╗
-- ╚══██╔══╝██╔══██╗██╔══██╗██║░░░░░██╔════╝██╔════╝
-- ░░░██║░░░███████║██████╦╝██║░░░░░█████╗░░╚█████╗░
-- ░░░██║░░░██╔══██║██╔══██╗██║░░░░░██╔══╝░░░╚═══██╗
-- ░░░██║░░░██║░░██║██████╦╝███████╗███████╗██████╔╝
-- ░░░╚═╝░░░╚═╝░░╚═╝╚═════╝░╚══════╝╚══════╝╚═════╝░


--Admin Tables---------------------------------------------------------------------------------------------------

CREATE TABLE branch (
    branch_name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE admin_account_type (
    type VARCHAR(20) PRIMARY KEY,
    description TEXT
);

CREATE TABLE admin_account (
    user_id UUID PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    status BOOLEAN DEFAULT FALSE,
    branch_name VARCHAR(20),
    account_type VARCHAR(20) NOT NULL,

    FOREIGN KEY(branch_name) REFERENCES branch(branch_name) ON DELETE RESTRICT,
    FOREIGN KEY(account_type) REFERENCES admin_account_type(type) ON DELETE RESTRICT
);