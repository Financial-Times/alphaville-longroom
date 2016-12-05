INSERT INTO tags_to_posts (
	tag_id,
	post_id
) VALUES (
	${tag_id},
	${post_id}
) RETURNING tag_id
