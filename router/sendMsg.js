const express = require("express")
const router = express.Router()
const middleware = require("../middleware")
const rabbitmq = require("../tools/rabbitmq")

router.post(
    '/',
    middleware.validFields,
    async (req, resp) => {
        rabbitmq.sender(req.body).then(() => { }).catch(() => { })
        rabbitmq.listener().then(() => {
            resp.send('DONE')
        }).catch(err => { 
            console.log(err)
        })
    }
)


module.exports = router
