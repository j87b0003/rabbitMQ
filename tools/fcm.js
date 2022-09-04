const firebaseAdmin = require('firebase-admin')
const fcm = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(process.env.serviceAccountKey)
})

module.exports = firebaseCloudMessage = {
    default: () => {
        return {
            token: undefined,
            name: undefined,
            data: {},
            notification: {
                title: undefined,
                body: undefined
            },
            android: {
                notification: {
                    sound: 'default'
                }
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default'
                    }
                }
            },
            webpush: {

            }
        }
    },
    init: (require, option) => {
        let msg = firebaseCloudMessage.default()
        if (require) {
            if (require.name) {
                msg.name = require.name
            }
            if (require.data) {
                msg.data = require.data
            }
            if (require.notification) {
                msg.notification = require.notification
            }
            if (require.topic) {
                let topic = require.topic
                msg.topic = encodeURI(topic)
            }
        }

        if (option) {

        }
        return msg
    },
    send: (msg, doc) => {
        return new Promise((resolve, reject) => {
            let obj = {}
            let m = firebaseCloudMessage.init(msg.require, msg.option)

            if (doc) {
                obj = {
                    token: doc.token,
                    deviceId: doc.deviceId
                }
                m.token = doc.token
            }
            fcm.messaging().send(m).then(resp => {
                obj.response = resp.toString()
                resolve(obj)
            }).catch(err => {
                obj.response = err.toString()
                reject(obj)
            })
        })
    },
    subscribeToTopic: (tokens, topic) => {
        let obj = {}
        return new Promise((resolve, reject) => {
            fcm.messaging().subscribeToTopic(tokens, encodeURI(topic)).then(resp => {
                obj.response = resp.toString()
                resolve(obj)
            }).catch(err => {
                console.log(err)
                obj.response = err.toString()
                reject(obj)
            })
        })
    },
    unsubscribeFromTopic: (tokens, topic) => {
        let obj = {}
        return new Promise((resolve, reject) => {
            fcm.messaging().unsubscribeFromTopic(tokens, encodeURI(topic)).then(resp => {
                obj.response = resp.toString()
                resolve(obj)
            }).catch(err => {
                obj.response = err.toString()
                reject(obj)
            })
        })
    }
}
