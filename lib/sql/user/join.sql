INSERT INTO users(
    user_id,
    location,
    description,
    summary
) VALUES (
    ${user_id},
    ${location},
    ${description},
    ${summary}
) RETURNING user_id
