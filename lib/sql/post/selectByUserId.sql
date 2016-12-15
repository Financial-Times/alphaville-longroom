SELECT
    p.*,
    t.name tag_name,
    t.id tag_id,
    ttp.index tag_index,
    f.name file_name,
    f.size file_size,
    f.ext file_ext,
    f.source file_source
FROM
    posts p
    LEFT JOIN tags_to_posts ttp ON ttp.post_id = p.id
    JOIN tags t ON t.id = ttp.tag_id
    LEFT JOIN files f ON f.post_id = p.id
WHERE
    p.id IN (
        SELECT pi.id
        FROM posts pi
        WHERE
            pi.user_id = ${user_id}
        ORDER BY pi.published_at DESC
        OFFSET ${offset}
        LIMIT ${limit}
    )
ORDER BY p.published_at DESC
