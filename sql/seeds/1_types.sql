INSERT INTO job_title 
    VALUES
        ('HR Manager'),
        ('Accountant'),
        ('Software Engineer'),
        ('QA Engineer');

INSERT INTO employment_status 
    VALUES
        ('Intern Full Time'),
        ('Intern Part Time'),
        ('Contract Full Time'),
        ('Contract Part Time'),
        ('Permanent'),
        ('Freelance');

INSERT INTO leave_type 
    VALUES
        ('Annual'),
        ('Casual'),
        ('Maternity'),
        ('No-pay');

INSERT INTO leave_request_state 
    VALUES
        ('Pending'),
        ('Approved'),
        ('Rejected');


INSERT INTO admin_account_type
    VALUES
        ('Super Admin', ''),
        ('Admin', '');

INSERT INTO employee_account_type
    VALUES
        ('Managerial Employee', ''),
        ('Supervisor', ''),
        ('Employee', '');

INSERT INTO branch
    VALUES
        ('Sri Lanka'),
        ('Bangladesh'),
        ('Pakistan');

INSERT INTO department
    VALUES
        ('HR'),
        ('Financial'),
        ('Security'),
        ('Quality Assurance'),
        ('ICT');


INSERT INTO pay_grade
    VALUES
        ('Level 1', 50,50,50,50),
        ('Level 2', 50,50,50,50),
        ('Level 3', 50,50,50,50);