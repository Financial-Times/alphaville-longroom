SELECT
   COUNT(*) as count
FROM
   posts p
WHERE
   p.published != false AND
   p.user_id = ${user_id}
