-- SELECT name, genre
--
-- SELECT *
-- FROM boardgames;

-- SELECT name FROM boardgames
-- WHERE id = 5;

SELECT name, avg_rating
FROM boardgames
WHERE avg_rating >= 8.5;

SELECT name, max_players
FROM boardgames
WHERE max_players < 5;

SELECT name, max_players, avg_rating
FROM boardgames
WHERE max_players < 5 AND avg_rating >= 8.5;