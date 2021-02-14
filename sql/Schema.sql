-- Clean Schema
DROP TABLE IF EXISTS leave_approval_supervisor;
DROP TABLE IF EXISTS leave_request;
DROP TABLE IF EXISTS admin_account;
DROP TABLE IF EXISTS employee_account;
DROP TABLE IF EXISTS user_account;
DROP TABLE IF EXISTS supervisor;
DROP TABLE IF EXISTS custom_details;
DROP TABLE IF EXISTS employee_emergency_detail;
DROP TABLE IF EXISTS employee_personal_detail;
DROP TABLE IF EXISTS employee_company_detail;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS pay_grade;
DROP TABLE IF EXISTS branch;
DROP TABLE IF EXISTS leave_type;
DROP TABLE IF EXISTS leave_request_state;
DROP TABLE IF EXISTS employment_status;
DROP TABLE IF EXISTS job_title;



-- ████████╗░█████╗░██████╗░██╗░░░░░███████╗░██████╗
-- ╚══██╔══╝██╔══██╗██╔══██╗██║░░░░░██╔════╝██╔════╝
-- ░░░██║░░░███████║██████╦╝██║░░░░░█████╗░░╚█████╗░
-- ░░░██║░░░██╔══██║██╔══██╗██║░░░░░██╔══╝░░░╚═══██╗
-- ░░░██║░░░██║░░██║██████╦╝███████╗███████╗██████╔╝
-- ░░░╚═╝░░░╚═╝░░╚═╝╚═════╝░╚══════╝╚══════╝╚═════╝░


-- Types ---------------------------------------------------------------------------------------------------------------

CREATE TABLE  job_title (
    job_title VARCHAR(25) PRIMARY KEY
);

CREATE TABLE  employment_status (
    employment_status VARCHAR(20) PRIMARY KEY
);

CREATE TABLE leave_request_state (
    leave_state VARCHAR(20) PRIMARY KEY
);

CREATE TABLE leave_type (
    leave_type VARCHAR(20) PRIMARY KEY
);

-- ---------------------------------------------------------------------------------------------------------------------

CREATE TABLE branch (
    branch_ID UUID PRIMARY KEY,
    branch_name VARCHAR(20)
);


CREATE TABLE pay_grade (
    pay_grade VARCHAR(20) PRIMARY KEY,
    num_of_leaves SMALLINT
);

CREATE TABLE department (
    department_name VARCHAR(20) PRIMARY KEY
);


-- Employee Details ----------------------------------------------------------------------------------------------------
CREATE TABLE employee_company_detail (
    employee_id UUID PRIMARY KEY,
    branch_id UUID NOT NULL,
    job_title VARCHAR(25) NOT NULL,
    employment_status VARCHAR(20) NOT NULL,
    pay_grade VARCHAR(20) NOT NULL,
    department_name VARCHAR(20) NOT NULL,
    FOREIGN KEY(branch_id) REFERENCES branch(branch_id) ON DELETE RESTRICT,
    FOREIGN KEY(job_title) REFERENCES job_title(job_title),
    FOREIGN KEY(employment_status) REFERENCES employment_status(employment_status),
    FOREIGN KEY(pay_grade) REFERENCES pay_grade(pay_grade),
    FOREIGN KEY(department_name) REFERENCES department(department_name)
        
); 

CREATE TABLE employee_personal_detail (
    employee_id UUID PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL ,
    marital_status BOOLEAN NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT
);

CREATE TABLE employee_emergency_detail (
    employee_id UUID PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL ,
    email_address VARCHAR(20) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT
);

CREATE TABLE custom_details (
    employee_id UUID PRIMARY KEY,
    FOREIGN KEY (employee_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT
);

CREATE TABLE supervisor (
    supervisor_id UUID,
    employee_id UUID,
    PRIMARY KEY(supervisor_id, employee_id),
    FOREIGN KEY(supervisor_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT,
    FOREIGN KEY (employee_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT
);

-- User Accounts -------------------------------------------------------------------------------------------------------

CREATE TABLE user_account (
    user_id UUID PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(20) NOT NULL,
    email_address VARCHAR(50) NOT NULL
);


CREATE TABLE employee_account (
    user_id UUID PRIMARY KEY,
    employee_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (employee_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT
);

CREATE TABLE admin_account (
    user_id UUID PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE RESTRICT
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



-- ██╗░░░██╗██╗███████╗░██╗░░░░░░░██╗░██████╗
-- ██║░░░██║██║██╔════╝░██║░░██╗░░██║██╔════╝
-- ╚██╗░██╔╝██║█████╗░░░╚██╗████╗██╔╝╚█████╗░
-- ░╚████╔╝░██║██╔══╝░░░░████╔═████║░░╚═══██╗
-- ░░╚██╔╝░░██║███████╗░░╚██╔╝░╚██╔╝░██████╔╝
-- ░░░╚═╝░░░╚═╝╚══════╝░░░╚═╝░░░╚═╝░░╚═════╝░




-- ███████╗██╗░░░██╗███╗░░██╗░█████╗░████████╗██╗░█████╗░███╗░░██╗░██████╗
-- ██╔════╝██║░░░██║████╗░██║██╔══██╗╚══██╔══╝██║██╔══██╗████╗░██║██╔════╝
-- █████╗░░██║░░░██║██╔██╗██║██║░░╚═╝░░░██║░░░██║██║░░██║██╔██╗██║╚█████╗░
-- ██╔══╝░░██║░░░██║██║╚████║██║░░██╗░░░██║░░░██║██║░░██║██║╚████║░╚═══██╗
-- ██║░░░░░╚██████╔╝██║░╚███║╚█████╔╝░░░██║░░░██║╚█████╔╝██║░╚███║██████╔╝
-- ╚═╝░░░░░░╚═════╝░╚═╝░░╚══╝░╚════╝░░░░╚═╝░░░╚═╝░╚════╝░╚═╝░░╚══╝╚═════╝░





-- ██████╗░██████╗░░█████╗░░█████╗░███████╗██████╗░██╗░░░██╗██████╗░███████╗░██████╗
-- ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗██║░░░██║██╔══██╗██╔════╝██╔════╝
-- ██████╔╝██████╔╝██║░░██║██║░░╚═╝█████╗░░██║░░██║██║░░░██║██████╔╝█████╗░░╚█████╗░
-- ██╔═══╝░██╔══██╗██║░░██║██║░░██╗██╔══╝░░██║░░██║██║░░░██║██╔══██╗██╔══╝░░░╚═══██╗
-- ██║░░░░░██║░░██║╚█████╔╝╚█████╔╝███████╗██████╔╝╚██████╔╝██║░░██║███████╗██████╔╝
-- ╚═╝░░░░░╚═╝░░╚═╝░╚════╝░░╚════╝░╚══════╝╚═════╝░░╚═════╝░╚═╝░░╚═╝╚══════╝╚═════╝░