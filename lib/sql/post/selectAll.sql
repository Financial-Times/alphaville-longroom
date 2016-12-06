SELECT
	p.*,
	t.name tag_name,
	t.id tag_id,
	ttp.index tag_index,
	f.name file_name,
	f.size file_size,
	f.type file_type,
	f.source file_source
FROM
	posts p,
	tags_to_posts ttp,
	tags t,
	files f
WHERE
	ttp.post_id = p.id AND
	t.id = ttp.tag_id AND
	f.post_id = p.id AND
	p.published != false
ORDER BY p.published_at DESC
