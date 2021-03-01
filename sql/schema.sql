
--    █▀▀ █░░ █▀▀ █▀▀█ █▀▀█ 　 █▀▀ █▀▀ █░░█ █▀▀ █▀▄▀█ █▀▀█
--    █░░ █░░ █▀▀ █▄▄█ █▄▄▀ 　 ▀▀█ █░░ █▀▀█ █▀▀ █░▀░█ █▄▄█
--    ▀▀▀ ▀▀▀ ▀▀▀ ▀░░▀ ▀░▀▀ 　 ▀▀▀ ▀▀▀ ▀░░▀ ▀▀▀ ▀░░░▀ ▀░░▀

-- Leave Module
DROP TRIGGER IF EXISTS before_leave_request ON leave_request;
DROP FUNCTION IF EXISTS before_add_leave_request;

DROP VIEW IF EXISTS employee_remaining_leaves;
DROP VIEW IF EXISTS supervisor_leave_request;

DROP TABLE IF EXISTS leave_request;
DROP TABLE IF EXISTS leave_type;
DROP TABLE IF EXISTS leave_request_state;

-- Employee Module
DROP PROCEDURE IF EXISTS set_phone_numbers;
DROP VIEW IF EXISTS employee_login_details;
DROP FUNCTION IF EXISTS is_supervisor;

DROP VIEW IF EXISTS supervisor_employees;
DROP VIEW IF EXISTS employee_details_full;
DROP VIEW IF EXISTS employee_details_ea_ecd;

DROP TABLE IF EXISTS custom_details;
DROP TABLE IF EXISTS phone_number;
DROP TABLE IF EXISTS employee_emergency_detail;
DROP TABLE IF EXISTS employee_personal_detail;
DROP TABLE IF EXISTS employee_account;
DROP TABLE IF EXISTS employee_company_detail;
DROP TABLE IF EXISTS employee_account_type;
DROP TABLE IF EXISTS employment_status;

-- Admin Module
DROP TABLE IF EXISTS admin_account;
DROP TABLE IF EXISTS admin_account_type;

-- Core
DROP TABLE IF EXISTS pay_grade;
DROP TABLE IF EXISTS job_title;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS branch;



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

CREATE TABLE employee_custom_details (
    employee_id UUID PRIMARY KEY,
    FOREIGN KEY (employee_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT
);

-- Data types which are allowed for custom columns
--      TEXT    - VARCHAR(255)
--      NUMBER  - DECIMAL
-- * default value always should be a text. when data type is numeric it is converted internally
CREATE TYPE column_datatype AS ENUM ('TEXT', 'NUMBER');

CREATE TABLE custom_column (
    custom_column VARCHAR(100) PRIMARY KEY,
    data_type COLUMN_DATATYPE, -- 'TEXT' or 'NUMBER'
    default_value VARCHAR(255)
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
		NATURAL JOIN employee_custom_details
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


CREATE VIEW supervisor_details AS
    SELECT
            ecd.employee_id,
            ecd.branch_name,
            ecd.department_name,
            ecd.employment_status,
            ecd.job_title,
            ecd.pay_grade,
            epd.first_name,
            epd.last_name,
            epd.marital_status,
            COUNT(ecd2.employee_id) as subordinate_count
        FROM employee_company_detail ecd
        JOIN employee_personal_detail epd USING(employee_id)
        LEFT JOIN employee_company_detail ecd2
            ON ecd2.supervisor_id = ecd.employee_id
                WHERE ecd.pay_grade != 'Level 1' OR ecd.pay_grade != 'Level 2'
                GROUP BY ecd.employee_id, epd.first_name, epd.last_name, epd.marital_status;


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


CREATE VIEW employee_login_details AS
	SELECT *, is_supervisor(employee_id)
		FROM employee_account ea
		JOIN employee_company_detail ecd USING(employee_id)
		JOIN employee_personal_detail epd USING(employee_id);


CREATE PROCEDURE set_phone_numbers(emp_id UUID, phone_numbers JSON)
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


-- custom attribute triggers
-- Run after new insertion to custom_column
CREATE FUNCTION add_new_column() RETURNS trigger AS $$

	DECLARE
		_query TEXT;
    BEGIN
		IF NEW.data_type = 'TEXT' THEN
			_query := format(
                            'ALTER TABLE employee_custom_details ADD COLUMN %s %s DEFAULT ''%s''',
                            NEW.custom_column, 'VARCHAR(255)', NEW.default_value
		                );
		ELSE
			_query := format(
                            'ALTER TABLE employee_custom_details ADD COLUMN %s %s DEFAULT %s::DECIMAL',
                            NEW.custom_column, 'DECIMAL', NEW.default_value
		                );
		END IF;

	   	RAISE NOTICE '%', _query;
		EXECUTE _query;

	   	RETURN NEW;
    END;

$$ LANGUAGE plpgsql;


-- Run before removing custom column custom_column
CREATE FUNCTION remove_old_column() RETURNS trigger AS $$

	DECLARE
		_query TEXT;
    BEGIN

		_query := format(
                          'ALTER TABLE employee_custom_details DROP COLUMN %s',
                           OLD.custom_column
		                );


	   	RAISE NOTICE '%', _query;
		EXECUTE _query;

	   	RETURN OLD;
    END;

$$ LANGUAGE plpgsql;


CREATE TRIGGER add_new_column AFTER INSERT ON custom_column
    FOR EACH ROW EXECUTE PROCEDURE add_new_column();

CREATE TRIGGER remove_old_column BEFORE DELETE ON custom_column
    FOR EACH ROW EXECUTE PROCEDURE remove_old_column();


CREATE OR replace FUNCTION before_update_com_details() RETURNS trigger AS $$

    DECLARE
       	sup_sup_id UUID;
       	sup_pay_grade VARCHAR(20);
    BEGIN

        IF NEW.supervisor_id IS NOT NULL THEN
        	SELECT supervisor_id, pay_grade  INTO sup_sup_id, sup_pay_grade
        			FROM employee_company_detail ecd2
        				WHERE employee_id = NEW.supervisor_id;

        	IF NEW.employee_id = sup_sup_id THEN
                RAISE EXCEPTION 'Supervisor cannot become supervisor to his supervisor';
            END IF;

           	IF sup_pay_grade != 'Level 3' THEN
				RAISE EXCEPTION 'Supervisor must have pay grade of Level 1';
           	END IF;
        END IF;

        RETURN NEW;
    END;

$$ LANGUAGE plpgsql;

-- Trigger inserting into employee company details
CREATE TRIGGER before_update_com_details BEFORE INSERT OR UPDATE ON employee_company_detail
    FOR EACH ROW EXECUTE PROCEDURE before_update_com_details();



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
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reviewed_date DATE,
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
           lr.from_date,
           lr.to_date,
           lr.reviewed_date
        FROM employee_company_detail ecd
            NATURAL JOIN employee_personal_detail epd
            JOIN leave_request lr ON lr.employee_id = ecd.employee_id;


-- Leave count view
CREATE VIEW employee_remaining_leaves AS
	SELECT ecd.employee_id,
    		pg.annual_leaves - (select COALESCE(SUM(1 + (to_date - from_date)), 0) from leave_request
    				where employee_id = ecd.employee_id
    					and leave_status = 'Approved'
    					and leave_type = 'Annual'
    					and	date_part('year', (SELECT reviewed_date)) = date_part('year', (SELECT current_date)))
    				as annual,
    		pg.casual_leaves - (select COALESCE(SUM(1 + (to_date - from_date)), 0) from leave_request
    				where employee_id = ecd.employee_id
    					and leave_status = 'Approved'
    					and leave_type = 'Casual'
    					and	date_part('year', (SELECT reviewed_date)) = date_part('year', (SELECT current_date)))
    				as casual,
    		pg.maternity_leaves - (select COALESCE(SUM(1 + (to_date - from_date)), 0) from leave_request
    				where employee_id = ecd.employee_id
    					and leave_status = 'Approved'
    					and leave_type = 'Maternity'
    					and	date_part('year', (SELECT reviewed_date)) = date_part('year', (SELECT current_date)))
    				as maternity,
    		pg.maternity_leaves - (select COALESCE(SUM(1 + (to_date - from_date)), 0) from leave_request
    				where employee_id = ecd.employee_id
    					and leave_status = 'Approved'
    					and leave_type = 'No-pay'
    					and	date_part('month', (SELECT reviewed_date)) = date_part('month', (SELECT current_date)))
    				as nopay
    FROM employee_company_detail ecd
    	JOIN pay_grade pg ON pg.pay_grade = ecd.pay_grade;



-- Run before insert leave request
CREATE FUNCTION before_add_leave_request() RETURNS trigger AS $before_leave$

    DECLARE
        remaining INTEGER;
       	current_status VARCHAR(20);
    BEGIN
        -- Check whether supervisor is correct
        IF NEW.supervisor_id IS NOT NULL THEN
            IF (select supervisor_id from employee_company_detail ecd
               	    where employee_id = NEW.employee_id) != NEW.supervisor_id THEN
                RAISE EXCEPTION 'Unauthorized supervisor id';
            END IF;
        END IF;

       	IF NEW.leave_status IS NOT NULL THEN
            IF OLD.leave_status != 'Pending' THEN
                RAISE EXCEPTION 'Cannot change status from Approved or Rejected';
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