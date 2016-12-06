INSERT INTO tags_to_posts (
	tag_id,
	post_id,
	index
) VALUES (
	${tag_id},
	${post_id},
	${index}
) RETURNING tag_id
