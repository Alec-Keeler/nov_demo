const express = require('express');
const app = express();

app.use(express.json())  // this gives us req.body

app.get('/test', (req, res) => {
    res.send('Your app is live') // res.json
})

let data = [
    {name: 'Carcassonne'},
    {name: 'Settlers of Catan'},
];

app.post('/boardgames', (request, response) => {
    data.push(request.body)
    response.status(201)
    response.send('Thank you for adding a game to our list')
})

app.get('/boardgames', (req, res) => {
    res.json({
        ourBoardgames: data
    })
})

//put, patch, delete
//send, json, redirect, render

// Taking in user input
// req.body, req.query, req.params

app.get('/boardgames/search', (req, res, next) => {
    console.log(req.query)
    if (req.query.name) {
        for (let i = 0; i < data.length; i++) {
            const game = data[i];
            if (game.name === req.query.name) {
                res.json(data[i])
            }
        }
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
app.get('/boardgames/:id', arr, (req, res) => {
    console.log(req.params)

    if (data[req.params.id]) {
        res.json(data[req.params.id])
    } else {
        res.send('This record does not exist D:')
    }
})



const port = 8000
app.listen(port, () => console.log(`Listening on port ${port}...`))