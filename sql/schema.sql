
--    █▀▀ █░░ █▀▀ █▀▀█ █▀▀█ 　 █▀▀ █▀▀ █░░█ █▀▀ █▀▄▀█ █▀▀█
--    █░░ █░░ █▀▀ █▄▄█ █▄▄▀ 　 ▀▀█ █░░ █▀▀█ █▀▀ █░▀░█ █▄▄█
--    ▀▀▀ ▀▀▀ ▀▀▀ ▀░░▀ ▀░▀▀ 　 ▀▀▀ ▀▀▀ ▀░░▀ ▀▀▀ ▀░░░▀ ▀░░▀

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

DROP TABLE IF EXISTS admin_account;
DROP TABLE IF EXISTS admin_account_type;

DROP TABLE IF EXISTS leave_approval_supervisor;
DROP TABLE IF EXISTS leave_request;
DROP TABLE IF EXISTS leave_request_state;
DROP TABLE IF EXISTS leave_type;


--    █▀▀ █▀▀█ █▀▀█ █▀▀
--    █░░ █░░█ █▄▄▀ █▀▀
--    ▀▀▀ ▀▀▀▀ ▀░▀▀ ▀▀▀

CREATE TABLE branch (
    branch_name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE department (
    department_name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE  job_title (
    job_title VARCHAR(25) PRIMARY KEY
);

CREATE TABLE pay_grade (
    pay_grade VARCHAR(20) PRIMARY KEY,
    annual_leaves INTEGER  NOT NULL DEFAULT 50,
    casual_leaves INTEGER  NOT NULL DEFAULT 50,
    maternity_leaves INTEGER  NOT NULL DEFAULT 50,
    nopay_leaves INTEGER  NOT NULL DEFAULT 50
);


--    █▀▀█ █▀▀▄ █▀▄▀█ ░▀░ █▀▀▄
--    █▄▄█ █░░█ █░▀░█ ▀█▀ █░░█
--    ▀░░▀ ▀▀▀░ ▀░░░▀ ▀▀▀ ▀░░▀

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



--    █▀▀ █▀▄▀█ █▀▀█ █░░ █▀▀█ █░░█ █▀▀ █▀▀
--    █▀▀ █░▀░█ █░░█ █░░ █░░█ █▄▄█ █▀▀ █▀▀
--    ▀▀▀ ▀░░░▀ █▀▀▀ ▀▀▀ ▀▀▀▀ ▄▄▄█ ▀▀▀ ▀▀▀

CREATE TABLE  employment_status (
    employment_status VARCHAR(20) PRIMARY KEY
);

CREATE TABLE employee_account_type (
    type VARCHAR(20) PRIMARY KEY,
    description TEXT
);

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
    employee_id UUID,
    phone_number VARCHAR(20),
    PRIMARY KEY (employee_id, phone_number),
    FOREIGN KEY (employee_id) REFERENCES employee_emergency_detail(employee_id) ON DELETE RESTRICT
);

CREATE TABLE custom_details (
    employee_id UUID PRIMARY KEY,
    FOREIGN KEY (employee_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT
);


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
			(select employee_id, jsonb_agg(phone_number) from phone_number pn group by employee_id) as pns;


CREATE VIEW supervisor_employees AS
    SELECT  sup.employee_id AS supervisor_id,
    		sup.branch_name,
    		sup.department_name,
    		sup.job_title,
    		sup.pay_grade,
            jsonb_agg(emp.employee_id) AS employee_ids
        FROM employee_company_detail emp
            JOIN employee_company_detail sup ON emp.supervisor_id = sup.employee_id
                GROUP BY sup.employee_id;

CREATE VIEW employee_login_details AS
	SELECT *, is_supervisor(employee_id)
		FROM employee_account ea
		JOIN employee_company_detail ecd USING(employee_id)
		JOIN employee_personal_detail epd USING(employee_id);


CREATE FUNCTION is_supervisor(emp_id UUID) RETURNS BOOLEAN AS $is_sup$

    BEGIN

        PERFORM employee_id FROM employee_company_detail ecd WHERE ecd.supervisor_id = emp_id;
        IF FOUND THEN
            RETURN True;
        ELSE
            RETURN False;
        END IF;

    END;

$is_sup$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE set_phone_numbers(emp_id UUID, phone_numbers JSON)
LANGUAGE plpgsql
AS $pn$
	DECLARE
		_pn VARCHAR(20);
	BEGIN
		DELETE FROM phone_number WHERE employee_id = emp_id;
		FOR _pn IN SELECT * FROM (SELECT json_array_elements_text(phone_numbers)) pn
		loop
			INSERT INTO phone_number VALUES (emp_id, _pn::VARCHAR(20));
		END loop ;
	END ;
$pn$;


--    █░░ █▀▀ █▀▀█ ▀█░█▀ █▀▀
--    █░░ █▀▀ █▄▄█ ░█▄█░ █▀▀
--    ▀▀▀ ▀▀▀ ▀░░▀ ░░▀░░ ▀▀▀

CREATE TABLE leave_request_state (
    leave_state VARCHAR(20) PRIMARY KEY
);


CREATE TABLE leave_type (
    leave_type VARCHAR(20) PRIMARY KEY
);


CREATE TABLE leave_request (
    leave_id UUID PRIMARY KEY,
    employee_id UUID NOT NULL,
    leave_status VARCHAR(20) NOT NULL,
    leave_type VARCHAR(20) NOT NULL,
    requested_date DATE NOT NULL,
    approved_date DATE,
    supervisor_id UUID NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT,
    FOREIGN KEY (leave_status) REFERENCES leave_request_state(leave_state) ON DELETE RESTRICT,
    FOREIGN KEY (leave_type) REFERENCES leave_type(leave_type) ON DELETE RESTRICT,
    FOREIGN KEY (supervisor_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT
);


CREATE VIEW supervisor_leave_request As
    SELECT ecd.*,
    	   epd.first_name, epd.last_name, epd.marital_status,
           lr.leave_id,
           lr.leave_status,
           lr.leave_type,
           lr.requested_date,
           lr.approved_date
        FROM employee_company_detail ecd
            NATURAL JOIN employee_personal_detail epd
            JOIN leave_request lr ON lr.employee_id = ecd.employee_id;


-- Leave count view
CREATE VIEW employee_remaining_leaves AS
    SELECT ecd.employee_id,

    		pg.annual_leaves - (select count(leave_id) from leave_request
    				where employee_id = ecd.employee_id
    					and leave_state = 'Approved'
    					and leave_type = 'Annual'
    					and	date_part('year', (SELECT approved_date))) = date_part('year', (SELECT current_date)))
    				as annual,

    		pg.casual_leaves - (select count(leave_id) from leave_request
    				where employee_id = ecd.employee_id
    					and leave_state = 'Approved'
    					and leave_type = 'Casual'
    					and	date_part('year', (SELECT approved_date))) = date_part('year', (SELECT current_date)))
    				as casual,

    		pg.maternity_leaves - (select count(leave_id) from leave_request
    				where employee_id = ecd.employee_id
    					and leave_state = 'Approved'
    					and leave_type = 'Maternity'
    					and	date_part('year', (SELECT approved_date))) = date_part('year', (SELECT current_date)))
    				as maternity,

    		pg.maternity_leaves - (select count(leave_id) from leave_request
    				where employee_id = ecd.employee_id
    					and leave_state = 'Approved'
    					and leave_type = 'No-pay'
    					and	date_part('month', (SELECT approved_date))) = date_part('month', (SELECT current_date)))
    				as nopay,

    FROM employee_company_detail ecd
    	JOIN pay_grade pg ON pg.pay_grade = ecd.pay_grade;



-- Run before insert leave request
CREATE FUNCTION before_add_leave_request() RETURNS trigger AS $before_leave$

    DECLARE
        remaining INTEGER;
    BEGIN

        -- Check whether supervisor is correct
        IF NEW.supervisor_id IS NOT NULL THEN
            IF (select supervisor_id from employee_company_detail ecd
               	    where employee_id = NEW.employee_id) != NEW.supervisor_id THEN
                RAISE EXCEPTION 'Unauthorized supervisor id';
            END IF;
        END IF;

        IF NEW.leave_type = 'Annual' THEN
            SELECT annual INTO remaining FROM employee_remaining_leaves WHERE employee_id = NEW.employee_id;
        ELSIF NEW.leave_type = 'Casual' THEN
            SELECT annual INTO remaining FROM employee_remaining_leaves WHERE employee_id = NEW.employee_id;
        ELSIF NEW.leave_type = 'Maternity' THEN
            SELECT annual INTO remaining FROM employee_remaining_leaves WHERE employee_id = NEW.employee_id;
        ELSIF NEW.leave_type = 'No-pay' THEN
            SELECT annual INTO remaining FROM employee_remaining_leaves WHERE employee_id = NEW.employee_id;
        ELSE
            RAISE EXCEPTION 'Invalid leave type';
        END IF;

        IF remaining <= 0 THEN
            RAISE EXCEPTION 'No remaining leaves';
        ELSE
            RETURN NEW;
        END IF;
    END;

$before_leave$ LANGUAGE plpgsql;

-- Trigger when insert a leave request
CREATE TRIGGER before_leave_request BEFORE INSERT OR UPDATE ON leave_request
    FOR EACH ROW EXECUTE PROCEDURE before_add_leave_request();