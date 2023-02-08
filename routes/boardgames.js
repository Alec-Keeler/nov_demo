const express = require('express')
const router = express.Router()
const data = require('../data')

const {Boardgame} = require('../db/models')

// router.get('/test', async (req, res) => {
//     let game = Boardgame.build({
//         name: 'Monopoly',
//         maxPlayers: 4
//     })
//     // INSERT INTO Boardgames (name, maxPlayers) VALUES ('Monopolyyyyy', 4);
//     game.validate()

//     await game.save()

//     res.json(game)
// })




const { Op } = require("sequelize");


// /boardgames
router.get('/', async(req, res) => {
    const games = await Boardgame.findAll({
        where: {
            gameName: {
                [Op.like]: 'T%'
            },
            // maxPlayers: 6
        },
        order: [['maxPlayers', 'DESC'], ['gameName', 'DESC']]
        // order: ['maxPlayers']
    })
    res.json({games})
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
// /boardgames/search?name=Spirit Island
router.get('/search', async(req, res, next) => {
    console.log(req.query)
    if (req.query.name) {
        // findByPk, findOne, findAll
        // .findByPk(req.params.id, {})
        // .findOne({})  // ONLY returns one record
        // .findAll({})  // Always returns an array
        try {
            let game = await Boardgame.findOne({
                where: {
                    // gameName: req.query.name
                    maxPlayers: 5
                }
            })
            res.json({
                // game: game
                game
            })
        } catch (err) {
            console.log(err)
        }
    } else {
        res.send('please include a name query parameter')
    }
})



// /boardgames/banana
// /boardgames/1
// /boardgames/search

// const checkData = (req, res, next) => {
//     let index = req.params.id
//     if (data.length - 1 < index) {
//         return res.send('This game could not be found')
//     }
//     next()
// }
// let arr = [checkData]
router.get('/:id', async(req, res) => {
    console.log(req.params)

    const game = await Boardgame.findByPk(req.params.id)
    res.json(game)


    // sql code, parameters, callback
    // const sql = 'SELECT * FROM boardgames JOIN reviews ON (boardgames.id = reviews.boardgame_id) WHERE boardgames.id = ?;'
    // const params = [req.params.id]
    // db.all(sql, params, (err, rows) => {
    //     console.log(err)
    //     console.log(rows)
    //     res.json(rows)
    // })
})

module.exports = router;