-- Stored Procedure: UpdateGameStatistics
-- This procedure updates the statistics of a game such as average rating and total ratings count.
-- It is linked to the existing functionality in app/Http/Controllers/Api/GameController.php
-- which calls this procedure when showing a game.

DELIMITER $$

CREATE PROCEDURE UpdateGameStatistics(IN gameId INT)
BEGIN
    -- Update average rating and ratings count for the game
    UPDATE games g
    LEFT JOIN (
        SELECT
            game_id,
            COUNT(*) AS ratings_count,
            IFNULL(AVG(rating), 0) AS avg_rating
        FROM ratings
        WHERE game_id = gameId
        GROUP BY game_id
    ) r ON g.id = r.game_id
    SET
        g.ratings_count = IFNULL(r.ratings_count, 0),
        g.avg_rating = IFNULL(r.avg_rating, 0)
    WHERE g.id = gameId;

    -- Optionally, update other statistics such as total views if stored in another table
    -- For example, if views are stored in a 'game_views' table:
    -- UPDATE games g
    -- LEFT JOIN (
    --     SELECT game_id, COUNT(*) AS total_views FROM game_views WHERE game_id = gameId GROUP BY game_id
    -- ) v ON g.id = v.game_id
    -- SET g.views = IFNULL(v.total_views, 0)
    -- WHERE g.id = gameId;
END$$

DELIMITER ;
