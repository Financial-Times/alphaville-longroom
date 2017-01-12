UPDATE posts SET
    title = ${title},
    summary = ${summary},
    post_type = ${post_type},
    user_id = ${user_id},
    published = ${published},
    published_at = ${published_at}
WHERE
    id = ${id}
RETURNING id
