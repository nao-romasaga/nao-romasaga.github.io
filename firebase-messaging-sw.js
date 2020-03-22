importScripts('https://www.gstatic.com/firebasejs/5.5.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.4/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '82869347272'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
});