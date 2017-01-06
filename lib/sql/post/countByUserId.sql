SELECT
   COUNT(*) as count
FROM
   posts p
WHERE
   p.published = ${published} AND
   p.user_id = ${user_id}
