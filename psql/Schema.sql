CREATE TABLE branch (
    branch_ID uuid PRIMARY KEY,
    branch_name VARCHAR(20)
);

CREATE TABLE employee_company_details (
    employee_id uuid PRIMARY KEY,
    branch_id uuid ,
    job_title VARCHAR(20),
    employment_status VARCHAR(20),
    pay_grade VARCHAR(20),
    department_name VARCHAR(20),
    FOREIGN KEY(branch_id) REFERENCES branch(branch_id),
    FOREIGN KEY(job_title) REFERENCES job_title(job_title),
    FOREIGN KEY(employment_status) REFERENCES job_title(employment_status),
    
); 

CREATE TABLE user (
    user_id uuid PRIMARY KEY,
    employee_id VARCHAR(50),
)

CREATE TABLE employee_user (
    user_id uuid PRIMARY KEY,
    employee_id uuid,
    FOREIGN KEY ()
)



CREATE TABLE employee_personal_detail (
    employee_id uuid PRIMARY KEY,
    name VARCHAR(20),
    date_of_birth DATE
)