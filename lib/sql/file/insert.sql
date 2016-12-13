INSERT INTO files (
	name,
	size,
	ext,
	user_id
) VALUES (
	${name},
	${size},
	${ext},
	${user_id}
) RETURNING id
