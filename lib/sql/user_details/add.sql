INSERT INTO user_details (
  user_id,
  first_name,
  last_name,
  email,
  phone,
  industry,
  position,
  responsibility
) VALUES (
  ${user_id},
  ${first_name},
  ${last_name},
  ${email},
  ${phone},
  ${industry},
  ${position},
  ${responsibility}
) RETURNING user_id
