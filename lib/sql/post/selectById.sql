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
	p.id = ${id}
