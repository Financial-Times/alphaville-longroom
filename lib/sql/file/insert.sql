INSERT INTO files (
    name,
    size,
    ext,
    user_id,
    is_embedded
) VALUES (
    ${name},
    ${size},
    ${ext},
    ${user_id},
    ${is_embedded}
) RETURNING id
