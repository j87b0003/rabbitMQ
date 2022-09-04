const amqplib = require("amqplib/callback_api")
const fcm = require("./fcm")
const database = require("./database")

module.exports = rabbitmq = {
    queueName: 'notification.fcm',
    topicName: 'notification.done',
    conn: async () => {
        return new Promise((resolve, reject) => {
            amqplib.connect(process.env.AMQP, (err, conn) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(conn)
                }

            })
        })

        return conn
    },
    sender: async (data) => {
        return new Promise((resolve, reject) => {
            rabbitmq.conn().then(conn => {
                // Sender
                conn.createChannel((err, sender) => {
                    if (err) {
                        reject(err)
                    } else {
                        sender.assertExchange(rabbitmq.topicName, 'topic', { durable: false })
                        sender.assertQueue(rabbitmq.queueName)
                        sender.sendToQueue(rabbitmq.queueName, Buffer.from(JSON.stringify(data)))
                        resolve(sender)
                    }

                })
            })
        })
    },
    listener: async () => {
        return new Promise((resolve, reject) => {
            rabbitmq.conn().then(conn => {
                conn.createChannel((err, listener) => {
                    if (err) {
                        reject(err)
                    } else {
                        listener.assertQueue(rabbitmq.queueName)
                        listener.consume(rabbitmq.queueName, (msg) => {

                            if (msg !== null) {
                                const data = JSON.parse(msg.content.toString())
                                listener.ack(msg)

                                fcm.send(data).then(() => {
                                    let d = {
                                        identifier: data.identifier,
                                        deliverAt: new Date().toISOString()
                                    }

                                    database.put(d).then(() => {
                                        listener.publish(rabbitmq.topicName, '', Buffer.from(JSON.stringify(d)))
                                        conn.close()
                                        resolve(listener)
                                    })

                                }).catch(err=>{
                                    console.log(err)
                                })
                            } else {
                                console.log('Consumer cancelled by server')
                            }
                        })
                    }
                })
            }).catch(err=>{
                console.log(err)
            })
        })
    },
}
