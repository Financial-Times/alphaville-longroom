SELECT
    COUNT(*) as count
FROM
    posts p
WHERE
    p.id IN (
        SELECT pi.id
        FROM posts pi
            LEFT JOIN tags_to_posts ttpi ON ttpi.post_id = pi.id
            JOIN tags ti ON ti.id = ttpi.tag_id
        WHERE 
            pi.published = ${published}
            AND (
                pi.title LIKE '%${query#}%'
                OR ti.name LIKE '%${query#}%'
            )
    )
