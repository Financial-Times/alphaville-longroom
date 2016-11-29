SELECT
	p.*,
	t.name tag_name,
	f.name file_name,
	f.size file_size,
	f.type file_type,
	f.source file_source,
FROM
	posts p,
	tags_to_posts ttp,
	tags t,
	files f
WHERE
	ttp.post_id = p.id AND
	t.tag_id = ttp.tag_id AND
	f.post_id = p.id AND
	user_id = ${user_id}
