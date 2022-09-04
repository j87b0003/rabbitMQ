const express = require("express")
const router = express.Router()
const middleware = require("../middleware")
const amqplib = require('amqplib/callback_api')
const fcm = require("../tools/fcm")
const database = require("../tools/database")

router.post(
    '/',
    middleware.validFields,
    async (req, resp) => {
        const queue = 'notification.fcm'
        amqplib.connect(process.env.AMQP, (err, conn) => {
            if (err) throw err;

            // Sender
            conn.createChannel((err, sender) => {
                if (err) throw err;

                sender.assertQueue(queue)
                sender.sendToQueue(queue, Buffer.from(JSON.stringify(req.body)))
            })

            // Listener
            conn.createChannel((err, listener) => {
                if (err) throw err;

                listener.assertQueue(queue)
                listener.consume(queue, (msg) => {
                    if (msg !== null) {
                        const data = JSON.parse(msg.content.toString())
                        listener.ack(msg)

                        fcm.send(data).then((response) => {

                            database.put({
                                identifier: data.identifier,
                                deliverAt: new Date().toISOString()
                            }).then(() => {
                                
                            })

                        })
                    } else {
                        console.log('Consumer cancelled by server')
                    }
                })
            })


        })

    }
)


module.exports = router
