importScripts('https://www.gstatic.com/firebasejs/5.11.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.11.0/firebase-messaging.js');

const thirtyDays = 30 * 24 * 60 * 60;

workbox.skipWaiting();
workbox.clientsClaim();

workbox.routing.registerRoute('/', workbox.strategies.staleWhileRevalidate());

workbox.routing.registerRoute(
    new RegExp('\\.html$'),
    workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
    new RegExp('/.\\.js$'),
    workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
    /\/media\/catalog.*\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'catalog',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: thirtyDays // 30 Days
            })
        ]
    })
);

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: thirtyDays // 30 Days
            })
        ]
    })
);

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.

// TODO: Add fallbacks

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
const config = {
    apiKey: "AIzaSyD1aOt4RTP2jm6nH0KLIBK6dP5aIcdMuXY",
    authDomain: "b2bdemo-da1f3.firebaseapp.com",
    databaseURL: "https://b2bdemo-da1f3.firebaseio.com",
    projectId: "b2bdemo-da1f3",
    storageBucket: "b2bdemo-da1f3.appspot.com",
    messagingSenderId: "146302744226",
    appId: "1:146302744226:web:020b991d434b773f"
};

firebase.initializeApp(config);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    if (payload.notification) {
        var notificationTitle = payload.notification.title;
        var notificationOptions = {
            body: payload.notification.body,
            icon: payload.notification.icon,
            badge: payload.notification.icon
        };
    } else {
        var notificationTitle = 'Test';
        var notificationOptions = {
            body: 'Send From Firebase Cloud',
        };
    }

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});
