INSERT INTO users(
  user_id,
  email,
  title,
  first_name,
  last_name,
  industry,
  position,
  responsibility
) VALUES (
  ${user_id},
  ${email},
  ${title},
  ${first_name},
  ${last_name},
  ${industry},
  ${position},
  ${responsibility}
) RETURNING user_id
