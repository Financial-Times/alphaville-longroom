INSERT INTO files (
	name,
	size,
	type
) VALUES (
	${name},
	${size},
	${type}
) RETURNING id
