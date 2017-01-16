SELECT *
FROM files
WHERE post_id IS NULL
    AND created_at < NOW() - INTERVAL '1 day'
