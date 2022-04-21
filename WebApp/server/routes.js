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

        connection.query(`SELECT tourney_name AS tourney, tourney_date AS date, surface, P1.name_first AS winner, P2.name_first AS looser, score, best_of
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
        connection.query(`SELECT tourney_name AS tourney, tourney_date AS date, surface, P1.name_first AS winner, P2.name_first AS looser, score, best_of
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

        connection.query(`SElECT name_first AS firstName, name_last AS lastName, hand, dob as dateOfBirth, ioc as Nationality, player_id AS PlayerId
        FROM Players
        ORDER BY firstName        
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
        connection.query(`SElECT name_first AS firstName, name_last AS lastName, hand, dob as dateOfBirth, ioc as Nationality
        FROM Players
        ORDER BY firstName`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}


// ********************************************
//             MATCH-SPECIFIC ROUTES
// ********************************************

// Route 5 (handler)


// ********************************************
//             SEARCH ROUTES
// ********************************************


module.exports = {
    hello,
    all_matches,
    all_players,
}