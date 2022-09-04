const express = require("express")
const app = express()
const dotEnv = require("dotenv")
const config = require('./tools/database')
dotEnv.config()

app.use(express.json())
config.init()

app.get(
    '/regServiceWork',
    async (req, resp) => {
        resp.render('regServiceWork')
    }
)

app.use('/sendMsg', require("./router/sendMsg"))
app.use('/showMsg', require("./router/showMsg"))

app.use(express.static('public'))
app.set('view engine', 'pug')
app.listen(process.env.PORT, () => {
    console.log(`App listening on ${process.env.PORT}`)
})
