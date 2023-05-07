CREATE OR REPLACE FUNCTION check_project_match() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.name = OLD.name OR NEW.description = OLD.description THEN
        PERFORM pg_notify('match_event', 'Match found!');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER project_match_trigger
BEFORE INSERT OR UPDATE ON project
FOR EACH ROW
EXECUTE FUNCTION check_project_match();