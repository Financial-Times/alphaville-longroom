SELECT *
FROM users
LEFT JOIN user_details
ON users.user_id = user_details.user_id
WHERE users.status=${status}
ORDER BY users.added_at ASC
