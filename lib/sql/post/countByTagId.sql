SELECT
   COUNT(*) as count
FROM
   posts p
WHERE
   p.published != false AND
   p.id IN (
       SELECT ttp.post_id
       FROM tags_to_posts ttp
       WHERE ttp.tag_id = ${tag_id}
    )