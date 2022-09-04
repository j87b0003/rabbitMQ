const firebaseAdmin = require('firebase-admin')
const fcm = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(process.env.SERVICE_ACCOUNT_KEY)
})

module.exports = firebaseCloudMessage = {
    send: (data) => {
        return new Promise((resolve, reject) => {
            let obj = {}
            let msg = {
                webpush: {
                    notification: {
                        title: 'Incoming message',
                        body: data.text
                    }
                },
                token: data.deviceId
            }

            fcm.messaging().send(msg).then(resp => {
                resolve(resp)
            }).catch(err => {
                reject(err.toString())
            })
        })
    }
}
