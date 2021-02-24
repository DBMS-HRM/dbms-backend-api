-- Clean Schema----------------------------------------------------

DROP TABLE IF EXISTS job_title;
DROP TABLE IF EXISTS employment_status;
DROP TABLE IF EXISTS pay_grade;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS employee_personal_detail;
DROP TABLE IF EXISTS employee_emergency_detail;
DROP TABLE IF EXISTS employee_account;
DROP TABLE IF EXISTS phone_number;
DROP TABLE IF EXISTS custom_details;
DROP TABLE IF EXISTS supervisor;
DROP TABLE IF EXISTS employee_company_detail;
DROP TABLE IF EXISTS employee_account_type;


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

-- ---------------------------------------------------------------------------------------------------------------------


CREATE TABLE pay_grade (
    pay_grade VARCHAR(20) PRIMARY KEY,
    annual_leaves INTEGER  NOT NULL DEFAULT 50,
    casual_leaves INTEGER  NOT NULL DEFAULT 50,
    maternity_leaves INTEGER  NOT NULL DEFAULT 50,
    noPay_leaves INTEGER  NOT NULL DEFAULT 50
);

CREATE TABLE department (
    department_name VARCHAR(20) PRIMARY KEY
);


-- Employee Details ----------------------------------------------------------------------------------------------------
CREATE TABLE employee_company_detail (
    employee_id UUID PRIMARY KEY,
    branch_name VARCHAR(20) NOT NULL,
    job_title VARCHAR(25) NOT NULL,
    employment_status VARCHAR(20) NOT NULL,
    pay_grade VARCHAR(20) NOT NULL,
    department_name VARCHAR(20) NOT NULL,
    supervisor_id UUID DEFAULT NULL,
    FOREIGN KEY(supervisor_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT,
    FOREIGN KEY(branch_name) REFERENCES branch(branch_name) ON DELETE RESTRICT,
    FOREIGN KEY(job_title) REFERENCES job_title(job_title) ON DELETE RESTRICT,
    FOREIGN KEY(employment_status) REFERENCES employment_status(employment_status) ON DELETE RESTRICT,
    FOREIGN KEY(pay_grade) REFERENCES pay_grade(pay_grade) ON DELETE RESTRICT,
    FOREIGN KEY(department_name) REFERENCES department(department_name) ON DELETE RESTRICT   
); 

CREATE TABLE employee_personal_detail (
    employee_id UUID PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL ,
    marital_status BOOLEAN NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT
);

CREATE TABLE employee_emergency_detail (
    employee_id UUID PRIMARY KEY,
    country TEXT NOT NULL ,
    district TEXT NOT NULL ,
    city TEXT NOT NULL ,
    street_1 TEXT NOT NULL ,
    street_2 TEXT,
    FOREIGN KEY (employee_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT
);

CREATE TABLE phone_number (
    employee_id UUID PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee_emergency_detail(employee_id) ON DELETE RESTRICT
);

CREATE TABLE custom_details (
    employee_id UUID PRIMARY KEY,
    FOREIGN KEY (employee_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT
);

--CREATE TABLE supervisor (
--    supervisor_id UUID,
--    employee_id UUID,
--    PRIMARY KEY(supervisor_id, employee_id),
--    FOREIGN KEY(supervisor_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT,
--    FOREIGN KEY (employee_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT
--);

-- User Accounts -------------------------------------------------------------------------------------------------------

CREATE TABLE employee_account_type (
    type VARCHAR(20) PRIMARY KEY,
    description TEXT
);

CREATE TABLE employee_account (
    employee_id UUID PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email_address VARCHAR(100) NOT NULL UNIQUE,
    account_type VARCHAR(20) NOT NULL,
    status BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (employee_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT,
    FOREIGN KEY (account_type) REFERENCES employee_account_type(type) ON DELETE RESTRICT
);



-- ▒█░░▒█ ░▀░ █▀▀ █░░░█ █▀▀
-- ░▒█▒█░ ▀█▀ █▀▀ █▄█▄█ ▀▀█
-- ░░▀▄▀░ ▀▀▀ ▀▀▀ ░▀░▀░ ▀▀▀

CREATE VIEW employee_details_ea_ecd AS
    SELECT ecd.*, ea.username, ea.email_address, ea.account_type, ea.status FROM employee_account ea
		JOIN employee_company_detail ecd ON ea.employee_id = ecd.employee_id;

CREATE VIEW employee_details_full AS
	SELECT *
	    FROM employee_account ea
		NATURAL JOIN employee_company_detail
		NATURAL JOIN employee_personal_detail
		NATURAL JOIN employee_emergency_detail
		NATURAL JOIN custom_details
		NATURAL JOIN
			(select employee_id, json_agg(phone_number) from phone_number pn group by employee_id) as pns;