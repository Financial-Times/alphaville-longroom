UPDATE users
SET location = ${location},
    description = ${description},
    summary = ${summary}
WHERE user_id = ${user_id}
