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
    approved_date DATE,
    supervisor_id UUID NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT,
    FOREIGN KEY (leave_state) REFERENCES leave_request_state(leave_state) ON DELETE RESTRICT,
    FOREIGN KEY (leave_type) REFERENCES leave_type(leave_type) ON DELETE RESTRICT,
    FOREIGN KEY (supervisor_id) REFERENCES employee_company_detail(employee_id) ON DELETE RESTRICT
);


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





