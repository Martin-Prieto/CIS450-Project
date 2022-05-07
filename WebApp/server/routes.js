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
    const league = req.params.league ? req.params.league : 'D1'
    //const pagesize = req.params.pagesize ? req.params.pagesize : 10
    // use this league encoding in your query to furnish the correct results

    if (req.query.page && !isNaN(req.query.page)) {
        // This is the case where page is defined.
        // The SQL schema has the attribute OverallRating, but modify it to match spec! 
        // TODO: query and return results here:
        // we have implemented this for you to see how to return results by querying the database
        var pagesize = 10;
        if (req.query.pagesize && !isNaN(req.query.pagesize)) {
            pagesize = req.query.pagesize;
        }

        connection.query(`SELECT M.loser_id AS LoserId, M.winner_id AS WinnerId, tourney_name AS tourney, tourney_date AS date, surface, P1.name AS winner, P2.name AS loser, score, best_of
        FROM Matches M, Players P1, Players P2
        WHERE P1.player_id = M.winner_id AND P2.player_id = M.loser_id
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
        // we have implemented this for you to see how to return results by querying the database
        connection.query(`SELECT M.loser_id AS LoserId, M.winner_id AS WinnerId, tourney_name AS tourney, tourney_date AS date, surface, P1.name AS winner, P2.name AS loser, score, best_of
        FROM Matches M, Players P1, Players P2
        WHERE P1.player_id = M.winner_id AND P2.player_id = M.loser_id`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// Route 4 (handler)
async function all_players(req, res) {
    // TODO: TASK 5: implement and test, potentially writing your own (ungraded) tests
    if (req.query.page && !isNaN(req.query.page)) {

        var pagesize = 10;
        if (req.query.pagesize && !isNaN(req.query.pagesize)) {
            pagesize = req.query.pagesize;
        }

        connection.query(`SElECT player_id AS PlayerId, name AS Name, hand, dob as dateOfBirth, ioc as Nationality, player_id AS PlayerId
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
        console.log(birthlow)
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


module.exports = {
    hello,
    all_matches,
    all_players,
    player,
    search_players,
}