SELECT *
FROM files
WHERE (post_id IS NULL OR post_id NOT IN (SELECT id FROM posts))
    AND created_at < NOW() - INTERVAL '1 day'
