const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();


// ********************************************
//            SIMPLE ROUTE EXAMPLE
// ********************************************

// Route 1 (handler)
async function hello(req, res) {
    // a GET request to /hello?name=Steve
    if (req.query.name) {
        res.send(`Hello, ${req.query.name}! Welcome to the FIFA server!`)
    } else {
        res.send(`Hello! Welcome to the FIFA server!`)
    }
}

async function all_matches(req, res) {
    console.log(req.params)

    const tourney = req.params.tourney ? req.params.tourney : 'Wimbledon'
    //const pagesize = req.params.pagesize ? req.params.pagesize : 10
    // use this league encoding in your query to furnish the correct results

    if (tourney === "All") {
        connection.query(`SELECT M.round AS round, M.match_id AS "key", M.loser_id AS LoserId, M.winner_id AS WinnerId, tourney_name AS tourney, tourney_date AS date, surface, P1.name AS winner, P2.name AS loser, score, best_of
        FROM (Matches M JOIN Players P1 ON P1.player_id = M.winner_id) JOIN Players P2 ON P2.player_id = M.loser_id
        ORDER BY tourney_date DESC`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });

    } else {
        connection.query(`SELECT M.round AS round, M.loser_id AS LoserId, M.winner_id AS WinnerId, tourney_name AS tourney, tourney_date AS date, surface, P1.name AS winner, P2.name AS loser, score, best_of
        FROM Matches M, Players P1, Players P2
        WHERE P1.player_id = M.winner_id AND P2.player_id = M.loser_id AND tourney_name = '${tourney}'
        ORDER BY tourney_date DESC`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

async function champions(req, res) {


    const tourney = req.params.tourney ? req.params.tourney : 'Wimbledon'
    //const pagesize = req.params.pagesize ? req.params.pagesize : 10
    // use this league encoding in your query to furnish the correct results
        connection.query(`WITH champs AS (
            SELECT year, champion, first_prize, player_id AS champ_id
            FROM Tourneys T JOIN Players P ON T.champion = P.name
            WHERE tourney_name = '${tourney}'
            ORDER BY year DESC
            ),
        inter_rankings AS (
            SELECT ranking_date, ranking, player, points
            FROM Rankings, champs
            WHERE Rankings.player = champs.champ_id
            ),
        inter_ranks AS (
            SELECT name, max(ranking) AS mRank, rYear
            FROM Players, (SELECT *, YEAR(ranking_date) as rYear FROM inter_rankings) R
            WHERE player_id = player
            GROUP BY rYear, name
            )
        SELECT year, champion, first_prize, mRank as champion_rank
        FROM champs C JOIN inter_ranks I ON C.champion = I.name
        WHERE year = rYear
        ORDER BY year DESC;`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });

}

// Route 4 (handler)
async function all_players(req, res) {
    // TODO: TASK 5: implement and test, potentially writing your own (ungraded) tests
    if (req.query.page && !isNaN(req.query.page)) {

        var pagesize = 10;
        if (req.query.pagesize && !isNaN(req.query.pagesize)) {
            pagesize = req.query.pagesize;
        }

        connection.query(`SElECT player_id AS PlayerId, name AS Name, hand, dob as dateOfBirth, ioc as Nationality
        FROM Players
        ORDER BY Name        
        LIMIT ${pagesize}
        OFFSET ${(req.query.page - 1) * pagesize}`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });

    } else {
        connection.query(`SElECT player_id AS PlayerId, name AS Name, hand, dob as dateOfBirth, ioc as Nationality
        FROM Players
        ORDER BY Name`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

async function player(req, res) {
    // TODO: TASK 7: implement and test, potentially writing your own (ungraded) tests

    if (req.query.id && Number.isInteger(parseInt(req.query.id))) {
        connection.query(`SELECT player_id AS PlayerId, Name, dob AS dateOfBirth, ioc AS Nationality, height, 
        CAST(DATEDIFF( Now(), dob )/365.25 AS UNSIGNED) AS age
        FROM Players 
        WHERE player_id = ${req.query.id}`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
             }
            });
    } else { res.json({ results: {} }) }
}

async function player_matches(req, res) {

    var playerId = '';
    if (req.query.PlayerId != null) {
        playerId = req.query.PlayerId;
    }
    var tourney = '';
    if (req.query.Tourney != null) {
        tourney = req.query.Tourney;
    }
    var date = '';
    if (req.query.Date != null) {
        date = req.query.Date;
    }

    connection.query(`SELECT M.round AS round, M.loser_id AS LoserId, M.winner_id AS WinnerId, tourney_name AS tourney, tourney_date AS date, surface, P1.name AS winner, P2.name AS loser, score
    FROM (Matches M JOIN Players P1 ON P1.player_id = M.winner_id) JOIN Players P2 ON P2.player_id = M.loser_id
    WHERE (P1.player_id  = ${playerId} OR P2.player_id  = ${playerId}) AND tourney_name = '${tourney}';
    
        `, function (error, results, fields) {
    
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });

}

async function search_players(req, res) {
    // TODO: TASK 9: implement and test, potentially writing your own (ungraded) tests
    // IMPORTANT: in your SQL LIKE matching, use the %query% format to match the search query to substrings, not just the entire string

    var name = '';
    if (req.query.Name != null) {
        name = req.query.Name;
    }
    var nationality = '';
    if (req.query.Nationality != null) {
        nationality = req.query.Nationality;
    }
    var hand = '';
    if (req.query.Hand != null) {
        hand = req.query.Hand;
    }
    var birthlow = 0;
    if (req.query.BirthLow != null && !isNaN(req.query.BirthLow)) {
        birthlow = req.query.BirthLow;
    }
    var birthhigh = 100;
    if (req.query.BirthHigh != null && !isNaN(req.query.BirthHigh)) {
        birthhigh = req.query.BirthHigh;
    }
    if (req.query.page && !isNaN(req.query.page)) {
        var pagesize = 10;
        if (req.query.pagesize && !isNaN(req.query.pagesize)) {
            pagesize = req.query.pagesize;
        }

        connection.query(`SELECT player_id AS PlayerId, Name, ioc AS Nationality, 
        FROM Players
        WHERE Name LIKE '%${name}%' AND ioc LIKE '%${nationality}%' AND hand LIKE '%${hand}%' AND dob >= ${birthlow}
            AND dob <= ${birthhigh}
        ORDER BY Name
        LIMIT ${pagesize}
        OFFSET ${(req.query.page - 1) * pagesize}
        `, function (error, results, fields) {
    
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });

    } else {
        connection.query(`SELECT player_id AS PlayerId, Name, ioc AS Nationality, dob AS dateOfBirth, hand
        FROM Players
        WHERE Name LIKE '%${name}%' AND ioc LIKE '%${nationality}%' AND hand LIKE '%${hand}%' AND dob >= ${birthlow}
        AND dob <= ${birthhigh}
        ORDER BY Name
        `, function (error, results, fields) {
    
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

async function advanced_player(req, res) {
    var playerId = 1;
    if (req.query.PlayerId != null) {
        playerId = req.query.PlayerId;
    }
    var timeHigh = 3000;
    if (req.query.TimeHigh != null) {
        timeHigh = req.query.TimeHigh;
    }
    var timeLow = 0;
    if (req.query.TimeLow != null) {
        timeLow = req.query.TimeLow;
    }

    connection.query(`WITH surface (surface, wins, name) AS
    (
        SELECT m.surface, COUNT(*) wins, p.name
        FROM Matches m JOIN Players p ON m.winner_id = p.player_id
        WHERE p.player_id = ${playerId} and m.tourney_date > '${timeLow}' AND m.tourney_date < '${timeHigh}'
        GROUP BY m.surface
        ORDER BY wins desc
        LIMIT 1

    ),
 money (total, champion) AS
    (
        SELECT SUM(t.first_prize), champion
        FROM Tourneys t JOIN Players p ON t.champion = p.name
        WHERE p.player_id = ${playerId} AND year > ${timeLow} and year < ${timeHigh}
    ),
     wins (wins, name) AS
    (
        SELECT COUNT(*) AS wins, p.name
        FROM Matches m JOIN Players p ON m.winner_id = p.player_id
        WHERE  p.player_id = ${playerId} AND m.tourney_date > '${timeLow}' AND m.tourney_date < '${timeHigh}'
        GROUP BY p.name
    ),
     loser (losses, name) AS
    (
        SELECT COUNT(*) AS losses, p.name
        FROM Matches m JOIN Players p ON m.loser_id = p.player_id
        WHERE p.player_id = ${playerId} AND m.tourney_date > '${timeLow}' AND m.tourney_date < '${timeHigh}'
        GROUP BY p.name
    )
SELECT s.name, s.surface AS BestSurface, m.total AS Money, w.wins AS Wins, l.losses AS Losses
FROM surface s, money m, wins w, loser l;`, function (error, results, fields) {
    
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });

}

async function left_right_stats(req, res) {
    var timeHigh = 3000;
    if (req.query.TimeHigh != null) {
        timeHigh = parseInt(req.query.TimeHigh);
    }
    var timeLow = 0;
    if (req.query.TimeLow != null) {
        timeLow = parseInt(req.query.TimeLow);
    }

    connection.query(`WITH top_four_tourneys (tourney_name) AS
    (SELECT tourney_name
     FROM Matches
     GROUP BY tourney_name
     ORDER BY COUNT(*) DESC
     LIMIT 4
    ),
  t5_data (tourney_name, winner_id) AS
    (SELECT M.tourney_name as tourney_name, winner_id
     FROM Matches M
        INNER JOIN top_four_tourneys t5 ON M.tourney_name = t5.tourney_name
     WHERE round = "F" AND tourney_date <= ${timeHigh} AND tourney_date >= ${timeLow}
    ),
  t5_players (player_id, height, hand) AS
    (SELECT player_id, height, hand
     FROM Players P
      INNER JOIN t5_data ON P.player_id = t5_data.winner_id
    )
  SELECT SUM(CASE hand WHEN 'Left' THEN 1 ELSE 0 end)  * 1.0 / COUNT(*) AS l_prop,
       SUM(CASE hand WHEN 'Right' THEN 1 ELSE 0 end)  * 1.0 / COUNT(*) AS r_prop,
       AVG(height) AS avg_height
       FROM t5_players;
  `, function (error, results, fields) {
    
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });

}

async function ranking(req, res){
    console.log(req.query.PlayerId)
    var playerId = 1;
    if (req.query.PlayerId != null) {
        playerId = req.query.PlayerId;
    }

    connection.query(`Select CAST(SUBSTRING(ranking_date, 1, 4) AS UNSIGNED) AS ranking_date, ranking
    FROM Rankings JOIN Players ON player = player_id
    WHERE player_id = ${playerId}
    ORDER BY ranking_date ASC;
        `, function (error, results, fields) {
    
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });


}


module.exports = {
    hello,
    all_matches,
    all_players,
    player,
    search_players,
    champions,
    player_matches,
    advanced_player,
    left_right_stats,
    ranking,
}