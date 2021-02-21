-- ████████╗░█████╗░██████╗░██╗░░░░░███████╗░██████╗
-- ╚══██╔══╝██╔══██╗██╔══██╗██║░░░░░██╔════╝██╔════╝
-- ░░░██║░░░███████║██████╦╝██║░░░░░█████╗░░╚█████╗░
-- ░░░██║░░░██╔══██║██╔══██╗██║░░░░░██╔══╝░░░╚═══██╗
-- ░░░██║░░░██║░░██║██████╦╝███████╗███████╗██████╔╝
-- ░░░╚═╝░░░╚═╝░░╚═╝╚═════╝░╚══════╝╚══════╝╚═════╝░


--Admin Tables---------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS admin_account;
DROP TABLE IF EXISTS admin_account_type;
DROP TABLE IF EXISTS branch;

CREATE TABLE branch (
    branch_id UUID PRIMARY KEY,
    branch_name VARCHAR(20)
);

CREATE TABLE admin_account_type (
    type VARCHAR(20) PRIMARY KEY
);

CREATE TABLE admin_account (
    user_id UUID PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT FALSE,
    branch_id UUID,
    account_type VARCHAR(20) NOT NULL,

    FOREIGN KEY(branch_id) REFERENCES branch(branch_id),
    FOREIGN KEY(account_type) REFERENCES admin_account_type(type)
);