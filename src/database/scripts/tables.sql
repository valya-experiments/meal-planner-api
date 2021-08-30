-- This script was generated by a beta version of the ERD tool in pgAdmin 4.
-- Please log an issue at https://redmine.postgresql.org/projects/pgadmin4/issues/new if you find any bugs, including reproduction steps.
BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public."MealTypes"
(
    id serial NOT NULL,
    name character varying NOT NULL,
    PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);

CREATE TABLE IF NOT EXISTS public."Meals"
(
    id uuid NOT NULL DEFAULT uuid_generate_v1(),
    name character varying(50) NOT NULL,
    date date NOT NULL,
    type integer NOT NULL,
    PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public."Meals"
    ADD FOREIGN KEY (type)
    REFERENCES public."MealTypes" (id)
    NOT VALID;

INSERT INTO public."MealTypes"(id, name) VALUES (10, 'breakfast');
INSERT INTO public."MealTypes"(id, name) VALUES (20, 'lunch');
INSERT INTO public."MealTypes"(id, name) VALUES (30, 'dinner');

END;
