-- SELECT name, genre
--
-- SELECT *
-- FROM boardgames;

-- SELECT name FROM boardgames
-- WHERE id = 5;

-- SELECT name, avg_rating
-- FROM boardgames
-- WHERE avg_rating >= 8.5;

-- SELECT name, max_players
-- FROM boardgames
-- WHERE max_players < 5;

-- SELECT name, max_players, avg_rating
-- FROM boardgames
-- WHERE max_players < 5 AND avg_rating >= 8.5;

-- DELETE FROM boardgames
-- WHERE avg_rating < 8.5;

UPDATE boardgames
SET avg_rating = 9.0
WHERE id = 5;

UPDATE boardgames
SET avg_rating = avg_rating + 1, max_players = 2
WHERE max_players = 4 AND avg_rating > 8.5;

-- Alec's favorite game
-- 'Alec''s favorite game'