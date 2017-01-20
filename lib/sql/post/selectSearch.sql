SELECT
    p.*,
    t.name tag_name,
    t.id tag_id,
    ttp.index tag_index,
    f.id file_id,
    f.name file_name,
    f.size file_size,
    f.ext file_ext,
    f.source file_source,
    u.summary user_summary
FROM
    posts p
    LEFT JOIN tags_to_posts ttp ON ttp.post_id = p.id
    JOIN tags t ON t.id = ttp.tag_id
    LEFT JOIN files f ON f.post_id = p.id
    LEFT JOIN users u ON u.user_id = p.user_id
WHERE
    p.id IN (
        SELECT pi.id
        FROM posts pi
        WHERE 
            pi.published = ${published}
            AND pi.id IN (
                SELECT pii.id
                FROM posts pii
                    LEFT JOIN tags_to_posts ttpi ON ttpi.post_id = pii.id
                    JOIN tags ti ON ti.id = ttpi.tag_id
                WHERE
                    pii.title LIKE '%${query#}%'
                    OR ti.name LIKE '%${query#}%'
            )
        ORDER BY pi.${orderBy^} DESC
        OFFSET ${offset}
        LIMIT ${limit}
    )
ORDER BY p.${orderBy^} DESC
