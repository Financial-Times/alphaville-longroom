CREATE TABLE IF NOT EXISTS files (
	id SERIAL PRIMARY KEY,
	name varchar(255) NOT NULL,
	size integer NOT NULL,
	type varchar(255) NOT NULL,
	source varchar(1000),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	post_id integer
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
	summary varchar(5000) NOT NULL,
	post_type varchar(255) NOT NULL,
	user_id integer NOT NULL,
	published BOOLEAN,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	published_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tags_to_posts (
	tag_id integer NOT NULL,
	post_id integer NOT NULL
);
CREATE INDEX tags_to_posts_tag_id ON tags_to_posts (tag_id);
CREATE INDEX tags_to_posts_post_id ON tags_to_posts (post_id);
