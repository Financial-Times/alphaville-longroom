INSERT INTO posts (
	title,
	summary,
	post_type,
	user_id,
	published,
	created_at,
	published_at
) VALUES (
	${title},
	${summary},
	${post_type},
	${user_id},
	${published},
	NOW(),
	${published_at}
) RETURNING id
