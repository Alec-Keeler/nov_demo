const express = require('express')
const router = express.Router()

const { Boardgame, Review, Genre, sequelize } = require('../db/models')
const { Op } = require("sequelize");

// Find all board games
// Order by gameName
// Include review rating average
// Include board game genres
router.get('/', async(req, res) => {
    const games = await Boardgame.findAll({
        include: {
            model: Genre,
            attributes: ['genre'],
            through: {
                attributes: []
            }
        },
        order: [['gameName'], [Genre, 'genre']]
    })

    let payload = []
    for (let i = 0; i < games.length; i++) {
        const game = games[i];
        let gameJson = game.toJSON()
        const gameRating = await Review.findOne({
            where: {
                gameId: game.id
            },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']
            ]
        })
        let rating = gameRating.dataValues.avgRating
        if (!rating) {
            gameJson.avgRating = 'No reviews yet'
        } else {
            gameJson.avgRating = rating
        }
        // console.log(gameJson)
        payload.push(gameJson)
    }

    res.json({Games: payload})
})

router.get('/:id(\\d+)', async(req, res, next) => {
    const game = await Boardgame.findByPk(req.params.id, {
        include: {
            model: Review
        },
        order: [[Review, 'rating', 'DESC']]
    })
    if (!game) {
        const err = new Error(`Game with an id of ${req.params.id} does not exist :(`)
        err.statusCode = 404
        return next(err)
    }
    res.json(game)
})

// Create new Boardgame
// Also add Genre join table records
    // body:
    // gameName, maxPlayers, genreStrings array

const gameCheck = (req, res, next) => {
    let errors = []
    if (!req.body.gameName) {
        errors.push('Game Name is required')
    }
    if (!req.body.maxPlayers) {
        errors.push('Max Player count is required')
    }
    if (errors.length > 0) {
        const err = new Error('Invalid user input')
        err.statusCode = 400
        err.errors = errors
        return next(err)
    }
    next()
}

router.post('/', gameCheck, async(req, res) => {
    const {gameName, maxPlayers, genreNames} = req.body

    const newGame = await Boardgame.create({
        gameName,
        maxPlayers
    })

    const genreList = await Genre.findAll({
        where: {
            genre: genreNames
        }
    })
    let genreIds = []
    for (let i = 0; i < genreList.length; i++) {
        const genre = genreList[i].toJSON();
        genreIds.push(genre.id)
    }
    
    await newGame.addGenres(genreIds)
    let gameId = newGame.toJSON().id
    const createdGame = await Boardgame.findByPk(gameId, {
        include: {
            model: Genre,
            attributes: ['genre'],
            through: {
                attributes: []
            }
        }
    })

    res.json({
        message: "Game successfully added to the database :)",
        game: createdGame
    })
})

const checkUpdateInput = (req, res, next) => {
    let errors = []
    if (!req.body.gameName && !req.body.maxPlayers) {
        errors.push('To update a game, please provide a new game name or max players value')
    }
    if (req.body.maxPlayers > 10 || req.body.maxPlayers < 1) {
        errors.push('Please provide a max players value between 1 and 10')
    }
    if (errors.length > 0) {
        const err = new Error('Something went wrong')
        err.statusCode = 400
        err.errors = errors
        return next(err)
    }
    next()
}

// gameName and/or maxPlayers
router.put('/:id', checkUpdateInput, async(req, res, next) => {
    const {gameName, maxPlayers} = req.body
    const gameToUpdate = await Boardgame.findByPk(req.params.id)

    if (!gameToUpdate) {
        const err = new Error(`Game with an id of ${req.params.id} does not exist :(`)
        err.statusCode = 404
        return next(err)
    }

    if (gameName) {
        gameToUpdate.set({
            gameName
        })
    }
    if (maxPlayers) {
        gameToUpdate.set({
            maxPlayers
        })
    }
    await gameToUpdate.save()

    res.json({
        message: `Successfully updated game with an id of ${req.params.id}`,
        game: gameToUpdate
    })
})

router.delete('/:id', async(req, res, next) => {
    const game = await Boardgame.findByPk(req.params.id)

    if (!game) {
        const err = new Error(`Game with an id of ${req.params.id} does not exist :(`)
        err.statusCode = 404
        return next(err)
    }

    try {
        
        await game.destroy()
    } catch (error) {
        console.log(error)
    }
    res.json({
        message: `The board game with an id of ${req.params.id} has been deleted`
    })
})

// req.query.gameName, req.query.minPlayers/maxPlayers
router.get('/search', async(req, res) => {
    let query = {
        where: {}
    }
    const {gameName, minPlayers, maxPlayers} = req.query
    if (gameName) {
        query.where.gameName = {
            [Op.substring]: gameName
        }
    }
    if (minPlayers && maxPlayers) {
        query.where.maxPlayers = {
            [Op.gte]: minPlayers,
            [Op.lte]: maxPlayers
        }
    } else if (minPlayers) {
        query.where.maxPlayers = {
            [Op.gte]: minPlayers
        }
    } else if (maxPlayers) {
        query.where.maxPlayers = {
            [Op.lte]: maxPlayers
        }
    }
    query.order = [['gameName']]
    const games = await Boardgame.findAll(query)
    res.json(games)
})

module.exports = router;