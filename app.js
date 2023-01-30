const express = require('express');
const app = express();

app.use(express.json())  // this gives us req.body

app.get('/test', (req, res) => {
    res.send('Your app is live') // res.json
})

let data = [];

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

const port = 8000
app.listen(port, () => console.log(`Listening on port ${port}...`))