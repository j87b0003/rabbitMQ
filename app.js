const express = require("express")
const app = express()
const dotEnv = require("dotenv")
const initializeApp = require('firebase/app').initializeApp
const getMessaging = require('firebase/messaging').getMessaging

dotEnv.config()

app.use(express.json())
app.get('/regServiceWork', (req, resp) => {
    resp.render('regServiceWork')
})
app.use(express.static('public'))
// app.use('/public', express.static(__dirname + '/public'))
app.set('view engine', 'pug')
app.listen(process.env.PORT, () => {
    console.log(`App listening on ${process.env.PORT}`)
})
