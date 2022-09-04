importScripts('https://www.gstatic.com/firebasejs/8.10/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10/firebase-messaging.js');
var firebaseConfig = {
    apiKey: "AIzaSyDEXeIXtQcLpOa-298QH8C3QC0ms-fwlPI",
    authDomain: "rabbitmq-2e76b.firebaseapp.com",
    projectId: "rabbitmq-2e76b",
    storageBucket: "rabbitmq-2e76b.appspot.com",
    messagingSenderId: "366417931563",
    appId: "1:366417931563:web:35c3dd35447c0b057e696e",
    measurementId: "G-8Q894706VS"
};// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };
    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});
self.addEventListener('notificationclick', event => {
    console.log(event)
});