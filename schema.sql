CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL,
    size integer NOT NULL,
    ext varchar(255) NOT NULL,
    source varchar(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id uuid NOT NULL,
    post_id integer,
    is_embedded boolean DEFAULT false
);
CREATE INDEX files_post_id ON files (post_id);

CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL
);
CREATE INDEX tags_name ON tags (name);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title varchar(255) NOT NULL,
    summary text NULL,
    post_type varchar(255) NOT NULL,
    user_id uuid NOT NULL,
    published BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tags_to_posts (
    tag_id integer NOT NULL,
    post_id integer NOT NULL,
    index integer NOT NULL
);
CREATE INDEX tags_to_posts_tag_id ON tags_to_posts (tag_id);
CREATE INDEX tags_to_posts_post_id ON tags_to_posts (post_id);

CREATE TYPE status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'revoked'
);

CREATE TABLE IF NOT EXISTS users (
    user_id uuid NOT NULL,
    status status DEFAULT 'pending'::status,
    added_at timestamp without time zone DEFAULT now(),
    eid bigint,
    is_editor boolean DEFAULT false,
    location character varying(256),
    description text,
    summary text,
    has_pseudonym boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS user_details (
    user_id uuid NOT NULL,
    first_name character varying(256),
    last_name character varying(256),
    phone character varying(256),
    email character varying(256),
    industry character varying(256),
    "position" character varying(256),
    responsibility character varying(256)
);

ALTER TABLE ONLY user_details
    ADD CONSTRAINT user_details_pkey PRIMARY KEY (user_id);

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);

ALTER TABLE ONLY user_details
    ADD CONSTRAINT user_details_id FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS cleanup_status (
    last_run TIMESTAMP
);
DELETE FROM cleanup_status;
INSERT INTO cleanup_status (last_run) VALUES ('1970-01-01 00:00:00');

INSERT INTO users (user_id, status, added_at, eid, is_editor, location, description, summary, has_pseudonym) VALUES ('3f330864-1c0f-443e-a6b3-cf8a3b536a52', 'approved', NOW(), 12313131232, true, '', '', '', true);