INSERT INTO files (
	name,
	size,
	type,
	user_id
) VALUES (
	${name},
	${size},
	${type},
	${user_id}
) RETURNING id
