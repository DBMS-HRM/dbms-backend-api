
-- Return true if user is supervisor
CREATE OR REPLACE FUNCTION public.is_supervisor(ch_supervisor_id uuid )
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
    BEGIN
        -- Check whether supervisor is correct
        IF ch_supervisor_id IS NOT NULL THEN
            IF ch_supervisor_id in (select supervisor_id from supervisor_employees) then
            	return true;
            else
            	return false;
            END IF;
        END IF;


    END;
$function$
;