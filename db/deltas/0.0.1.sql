-- Delta

DO $$
declare version text := '0.0.1';
begin
raise notice '## Running Delta v% ##', version;

CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS "deltas" (
  "id" serial PRIMARY KEY,
  "version" TEXT,
  "createdAt" timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY,
  "email" citext NOT NULL UNIQUE,
  "name" citext,
  "githubId" INT NOT NULL UNIQUE,
  "githubUsername" TEXT NOT NULL UNIQUE,
  "githubToken" TEXT NOT NULL,
  "createdAt" timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "proxies" (
  "id" serial PRIMARY KEY,
  "userId" INT NOT NULL REFERENCES "users" ("id"),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "type" TEXT NOT NULL,
  "middleware" JSON,
  "createdAt" timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "middleware" (
  "id" serial PRIMARY KEY,
  "userId" INT NOT NULL REFERENCES "users" ("id"),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "type" TEXT NOT NULL,
  "repo" TEXT NOT NULL UNIQUE,
  "createdAt" timestamptz DEFAULT now()
);

-- Update version
execute 'insert into deltas (version, "createdAt") values ($1, $2)' using version, now();

end$$;