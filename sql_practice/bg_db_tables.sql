-- name, max_players, avg_rating, genre
DROP TABLE IF EXISTS boardgames;
-- DROP TABLE boardgames;

CREATE TABLE boardgames (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL UNIQUE,
    max_players INTEGER DEFAULT 4,
    avg_rating DECIMAL(4, 2), -- 10.67, 1.25, 100.6, 9000
    genre VARCHAR(50) NOT NULL
);

