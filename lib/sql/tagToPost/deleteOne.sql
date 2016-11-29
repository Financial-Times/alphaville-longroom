DELETE FROM tags_to_posts
WHERE tag_id = ${tag_id} AND
	post_id = ${post_id}
