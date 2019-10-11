import firebase from 'firebase/app';
import '@firebase/messaging';

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

let messaging;

// we need to check if messaging is supported by the browser
if (firebase.messaging.isSupported()) {
    messaging = firebase.messaging();
}

export {
    messaging
};