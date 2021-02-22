----Clean Schema--------------------------------------------------------------

DROP TABLE IF EXISTS admin_account;
DROP TABLE IF EXISTS admin_account_type;
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
    username VARCHAR(20) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    status BOOLEAN DEFAULT FALSE,
    branch_name VARCHAR(20) NOT NULL,
    account_type VARCHAR(20) NOT NULL,

    FOREIGN KEY(branch_name) REFERENCES branch(branch_name) ON DELETE RESTRICT,
    FOREIGN KEY(account_type) REFERENCES admin_account_type(type) ON DELETE RESTRICT
);