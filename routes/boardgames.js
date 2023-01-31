const express = require('express')
const router = express.Router()
const data = require('../data')

router.post('/', (request, response) => {
    data.push(request.body)
    response.status(201)
    response.send('Thank you for adding a game to our list')
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
router.get('/:id', arr, (req, res) => {
    console.log(req.params)

    if (data[req.params.id]) {
        res.json(data[req.params.id])
    } else {
        res.send('This record does not exist D:')
    }
})

module.exports = router;