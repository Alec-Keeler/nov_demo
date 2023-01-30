const express = require('express');
const app = express();

app.get('/test', (req, res) => {
    res.send('Your app is live')
})

const port = 8000
app.listen(port, () => console.log(`Listening on port ${port}...`))