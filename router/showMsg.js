const express = require("express")
const router = express.Router()
const database = require("../tools/database")

router.get(
    '/',
    async (req, resp) => {
        database.list().then(rows => {
            let body = ''
            rows.forEach(ele => {
                body += JSON.stringify(ele.data) + '<br/>'
            });
            resp.send(body)
        })
    }
)


module.exports = router
