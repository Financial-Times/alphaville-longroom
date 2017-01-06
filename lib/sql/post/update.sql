UPDATE posts SET
    title = ${title},
    summary = ${summary},
    post_type = ${post_type},
    user_id = ${user_id},
    published = ${published}
WHERE
    id = ${id}
RETURNING id
