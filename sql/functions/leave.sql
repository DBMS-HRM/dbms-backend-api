

-- Run before insert leave request
CREATE FUNCTION before_add_leave_request() RETURNS trigger AS $before_leave$

    DECLARE
        remaining INTEGER;
    BEGIN

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
CREATE TRIGGER leave_request BEFORE INSERT OR UPDATE ON leave_request
    FOR EACH ROW EXECUTE PROCEDURE before_add_leave_request();