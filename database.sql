DROP DATABASE IF EXISTS foodfy;
CREATE DATABASE foodfy;

-- to run seeds
DELETE FROM users;
DELETE FROM chefs;
DELETE FROM recipes;
DELETE FROM files;
DELETE FROM recipe_files;

-- restart sequence auto_increment from tales ids
ALTER SEQUENCE chefs_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipe_files_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- users
CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "reset_token" TEXT,
    "reset_token_expires" TEXT,
    "is_admin" INT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP DEFAULT(now()),
    "updated_at" TIMESTAMP DEFAULT(now())
);

-- files
CREATE TABLE "files" (
    "id" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "path" text NOT NULL
);

-- chefs
CREATE TABLE "chefs" (
    "id" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "file_id" integer NOT NULL REFERENCES "files"("id"),
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now())
);

-- recipes
CREATE TABLE "recipes" (
    "id" SERIAL PRIMARY KEY,
    "chef_id" integer NOT NULL REFERENCES "chefs"("id") ON DELETE CASCADE,
    "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "title" text NOT NULL,
    "ingredients" text NOT NULL,
    "preparation" text NOT NULL,
    "information" text NOT NULL,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now())
);

-- recipe files
CREATE TABLE "recipe_files" (
    "id" SERIAL PRIMARY KEY,
    "recipe_id" integer REFERENCES "recipes"("id") ON DELETE CASCADE,
    "file_id" integer REFERENCES "files"("id")
);

-- connect-pg-simple session
CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session"
ADD CONSTRAINT "session_pkey"
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

--create procedure
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--auto updated_at users
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--auto updated_at chefs
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--auto updated_at recipes
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- cascade effect recipe files
ALTER TABLE ONLY recipe_files
ADD CONSTRAINT recipe_files_file_id_fkey 
FOREIGN KEY ("file_id") 
REFERENCES "files"("id") 
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY recipe_files
ADD CONSTRAINT recipe_files_recipe_id_fkey 
FOREIGN KEY ("recipe_id") 
REFERENCES "recipes"("id") 
ON UPDATE CASCADE ON DELETE CASCADE;