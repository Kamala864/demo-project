-- Active: 1683255805181@@127.0.0.1@5432@demo@public
CREATE OR REPLACE FUNCTION public.notify_project_match()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  existing_project "Project";
BEGIN
  
  SELECT * INTO existing_project FROM "Project"
  WHERE (name = NEW.name OR description = NEW.description)
    AND (name = NEW.name OR description = NEW.description)
    AND id <> NEW.id
  LIMIT 1;

  
  IF existing_project IS NOT NULL THEN
    PERFORM pg_notify('project_match', existing_project.id::text);
  END IF;

  RETURN NEW;
END;
$function$
