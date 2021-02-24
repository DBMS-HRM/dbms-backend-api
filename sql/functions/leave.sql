

-- Run before insert leave request
CREATE FUNCTION before_add_leave_request() RETURNS trigger AS $emp_stamp$
    BEGIN
        -- Check that empname and salary are given
        -- employee_id
        -- leave_type
        IF NEW.empname IS NULL THEN
            RAISE EXCEPTION 'empname cannot be null';
        END IF;
        IF NEW.salary IS NULL THEN
            RAISE EXCEPTION '% cannot have null salary', NEW.empname;
        END IF;

        -- Who works for us when she must pay for it?
        IF NEW.salary < 0 THEN
            RAISE EXCEPTION '% cannot have a negative salary', NEW.empname;
        END IF;

        -- Remember who changed the payroll when
        NEW.last_date := current_timestamp;
        NEW.last_user := current_user;
        RETURN NEW;
    END;
$emp_stamp$ LANGUAGE plpgsql;

CREATE TRIGGER leave_request BEFORE INSERT OR UPDATE ON leave_request
    FOR EACH ROW EXECUTE PROCEDURE before_add_leave_request();