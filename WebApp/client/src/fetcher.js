import config from './config.json'

const getAllMatches = async (page, pagesize, tourney) => {
    console.log(tourney)
    var res = await fetch(`http://${config.server_host}:${config.server_port}/matches/${tourney}?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getAllPlayers = async (page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/players?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getChampions = async (page, pagesize, tourney) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/champions/${tourney}?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getMatch = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/match?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getPlayer = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/player?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getMatchSearch = async (home, away, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/matches?Home=${home}&Away=${away}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getPlayerSearch = async (name, nationality, hand, birth_high, birth_low, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/players?Name=${name}&Nationality=${nationality}&Hand=${hand}&BirthLow=${birth_low}&BirthHigh=${birth_high}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getPlayerMatches = async (playerId, tourney, date, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/player/matches?PlayerId=${playerId}&Tourney=${tourney}&Date=${date}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getAdvancedDetails = async (playerId, timeHigh, timeLow, page, pagesize) => {
    console.log(timeLow)
    var res = await fetch(`http://${config.server_host}:${config.server_port}/advanced?PlayerId=${playerId}&TimeHigh=${timeHigh}&TimeLow=${timeLow}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getHandStats = async ( timeHigh, timeLow, page, pagesize) => {
    console.log(timeLow)
    var res = await fetch(`http://${config.server_host}:${config.server_port}/handStats?TimeHigh=${timeHigh}&TimeLow=${timeLow}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getRanking = async (playerId, timeHigh, timeLow, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/ranking?TimeHigh=${timeHigh}&TimeLow=${timeLow}&PlayerId=${playerId}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}


export {
    getAllMatches,
    getAllPlayers,
    getMatch,
    getPlayer,
    getMatchSearch,
    getPlayerSearch,
    getChampions,
    getPlayerMatches,
    getAdvancedDetails,
    getHandStats,
    getRanking,
}