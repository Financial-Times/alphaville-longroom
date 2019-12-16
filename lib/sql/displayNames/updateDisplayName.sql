UPDATE display_names
SET display_name = ${display_name}
WHERE user_id = ${user_id}
RETURNING user_id, display_name
