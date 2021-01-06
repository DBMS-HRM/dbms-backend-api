DROP TABLE IF EXISTS doc;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
   name VARCHAR(20) PRIMARY KEY,
   age INTEGER
);

CREATE TABLE doc (
   name VARCHAR(20) PRIMARY KEY,
   age INTEGER
);

INSERT INTO users(name, age) VALUES ('Pasindu1', 22);
INSERT INTO users(name, age) VALUES ('Pasindu2', 20);
INSERT INTO users(name, age) VALUES ('Pasindu3', 18);
INSERT INTO users(name, age) VALUES ('Yasith', 23);


SELECT name, age FROM users;