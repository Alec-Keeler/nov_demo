const express = require('express');
const app = express();

app.use(express.json())  // this gives us req.body

// app.use(express.static('assets'))
// app.use(express.static('assets/css')) // /css/css/styling.css
app.use('/banana', express.static('assets/css')) // /styling.css

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
app.get('/boardgames/:id', arr, (req, res) => {
    console.log(req.params)

    if (data[req.params.id]) {
        res.json(data[req.params.id])
    } else {
        res.send('This record does not exist D:')
    }
})

app.use((req, res, next) => {
    const err = new Error('We could not find the requested page')
    err.statusCode = 404
    next(err)
})

app.use((err, req, res, next) => {
    console.log(err)
    let status = err.statusCode || 500
    res.status(status)
    res.json({
        status: status,
        message: err.message
    })
})

const port = 8000
app.listen(port, () => console.log(`Listening on port ${port}...`))