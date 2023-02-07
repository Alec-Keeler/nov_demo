const express = require('express')
const router = express.Router()
const data = require('../data')

const {Boardgame} = require('../db/models')

router.get('/test', async (req, res) => {
    let game = Boardgame.build({
        name: 'Monopoly',
        maxPlayers: 4
    })
    // INSERT INTO Boardgames (name, maxPlayers) VALUES ('Monopolyyyyy', 4);
    game.validate()

    await game.save()

    res.json(game)
})






















const DATA_SOURCE = 'bg_db.db';

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(DATA_SOURCE, sqlite3.OPEN_READWRITE);

router.post('/', (request, response) => {
    // data.push(request.body)
    // response.status(201)
    // response.send('Thank you for adding a game to our list')
    const {name, avg_rating, max_players, genre} = request.body

    const sql = 'INSERT INTO boardgames (name, avg_rating, max_players, genre) VALUES (?, ?, ?, ?);'
    const params = [name, avg_rating, max_players, genre]
    db.run(sql, params, (err) => {
        if (err) {
            response.send(err)
        } else {
            response.send('You built a board game')
        }
    })
})

router.get('/', (req, res) => {
    res.json({
        ourBoardgames: data
    })
})

//put, patch, delete
//send, json, redirect, render

// Taking in user input
// req.body, req.query, req.params

router.get('/search', (req, res, next) => {
    console.log(req.query)
    if (req.query.name) {
        for (let i = 0; i < data.length; i++) {
            const game = data[i];
            if (game.name === req.query.name) {
                return res.json(data[i])
            }
        }
        const err = new Error('The Game you were looking for is not here :(')
        err.statusCode = 404
        next(err)
    } else {
        res.json(data)
    }
})



// /boardgames/banana
// /boardgames/1
// /boardgames/search

const checkData = (req, res, next) => {
    let index = req.params.id
    if (data.length - 1 < index) {
        return res.send('This game could not be found')
    }
    next()
}
let arr = [checkData]
router.get('/:id', (req, res) => {
    console.log(req.params)

    // sql code, parameters, callback
    const sql = 'SELECT * FROM boardgames JOIN reviews ON (boardgames.id = reviews.boardgame_id) WHERE boardgames.id = ?;'
    const params = [req.params.id]
    db.all(sql, params, (err, rows) => {
        console.log(err)
        console.log(rows)
        res.json(rows)
    })
})

module.exports = router;