SELECT
	COUNT(*) as count
FROM
	posts p
WHERE
	p.published != false
