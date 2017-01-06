UPDATE tags_to_posts
SET index = ${index}
WHERE
    tag_id = ${tag_id} AND
    post_id = ${post_id}
