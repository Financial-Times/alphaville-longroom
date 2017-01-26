SELECT t.name, count(*) as count
FROM tags t
    JOIN tags_to_posts ttp ON ttp.tag_id = t.id
WHERE name ILIKE '${term#}%'
GROUP BY t.id
ORDER BY count DESC
