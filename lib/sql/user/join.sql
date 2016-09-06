INSERT INTO users(
  user_id,
  email,
  title,
  first_name,
  last_name,
  industry,
  position,
  responsibility,
  location,
  description
) VALUES (
  ${user_id},
  ${email},
  ${title},
  ${first_name},
  ${last_name},
  ${industry},
  ${position},
  ${responsibility},
  ${location},
  ${description}
) RETURNING user_id
