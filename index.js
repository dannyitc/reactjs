import React from 'react';
import ReactDOM from 'react-dom';
import { setContext } from 'apollo-link-context';
import { Util } from '@magento/peregrine';

import { Adapter } from 'src/drivers';
import store from 'src/store';
import app from 'src/actions/app';
import App from 'src/components/App';
import './index.css';
import { messaging } from './firebase.js';
import graphqlService from 'src/services/graphql';
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Poppins:300,400,500,600,700']
  }
});
const { BrowserPersistence } = Util;
const apiBase = new URL('/graphql', location.origin).toString();
const storage = new BrowserPersistence();
const { graphql } = graphqlService;

/**
 * The Venia adapter provides basic context objects: a router, a store, a
 * GraphQL client, and some common functions. It is not opinionated about auth,
 * so we add an auth implementation here and prepend it to the Apollo Link list.
 */
const authLink = setContext((_, { headers }) => {
    // TODO: Get correct token expire time from API
    const token = storage.getItem('signin_token');

    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    };
});

ReactDOM.render(
    <Adapter
        apiBase={apiBase}
        apollo={{ link: authLink.concat(Adapter.apolloLink(apiBase)) }}
        store={store}
    >
        <App />
    </Adapter>,
    document.getElementById('root')
);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then(registration => {
                console.log('Service worker registered: ', registration);

                /**
                 * Push notifications
                 */

                if (!('Notification' in window)) { // check browser support
                    console.log('This browser does not support notifications!');
                } else {
                    Notification.requestPermission(status => { // Request permission
                        console.log('Notification permission status:', status);
                    });
                    if ('PushManager' in window) {
                        messaging.useServiceWorker(registration);
                        const token_firebase = storage.getItem('token_firebase');
                        if (!token_firebase) {
                            messaging.requestPermission()
                                .then(function () {
                                    console.log('Notification permission granted.');
                                    messaging.requestPermission()
                                        .then(function () {
                                            messaging.getToken()
                                                .then(function (currentToken) {
                                                    if (currentToken) {
                                                        console.log('Token is ' + currentToken);
                                                        storage.setItem('token_firebase', currentToken);
                                                        const params = {
                                                            query: `
                                                                mutation subscribeFirebase($token: String!) {
                                                                    subscribeFirebase(token: $token)
                                                                }
                                                            `.trim(),
                                                            variables: {
                                                                token: currentToken
                                                            }
                                                        }
                                                        graphql(params).then((result) => {
                                                            console.log(result);
                                                        }).catch((error) => {
                                                            console.log(error);
                                                        });
                                                    } else {
                                                        console.log('No Instance ID token available. Request permission to generate one.');
                                                    }
                                                })
                                                .catch(function (err) {
                                                    console.log('An error occurred while retrieving token. ', err);
                                                });
                                        })
                                        .catch(function (err) {
                                            console.log('Unable to get permission to notify.', err);
                                        });
                                })
                                .catch(function (err) {
                                    console.log('Unable to get permission to notify.', err);
                                });
                        }

                        messaging.onMessage(function (payload) {
                            console.log("Message received. ");
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
                            registration.showNotification(notificationTitle, notificationOptions);
                        });
                    }
                }
            })
            .catch(error => {
                console.log('Service worker registration failed: ', error);
            });
    });
}

window.addEventListener('online', () => {
    store.dispatch(app.setOnline());
});
window.addEventListener('offline', () => {
    store.dispatch(app.setOffline());
});


