const express = require('express');
const mysql      = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

// Route 1 - register as GET 
app.get('/hello', routes.hello)

// Route 3 - register as GET 
app.get('/matches/:tourney', routes.all_matches)

// Route 4 - register as GET 
app.get('/players', routes.all_players)

app.get('/champions/:tourney', routes.champions)

app.get('/player', routes.player)

app.get('/search/players', routes.search_players)

app.get('/player/matches', routes.player_matches)

app.get('/advanced', routes.advanced_player)

app.get('/handStats', routes.left_right_stats)

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
