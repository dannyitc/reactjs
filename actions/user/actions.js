import { createActions } from 'redux-actions';

const prefix = 'USER';
const actionTypes = [
    'COMPLETE_PASSWORD_RESET',
    'VIEW_DASHBOARD',
    'VIEW_PROFILE',
    'MANAGE_ORDERS',
    'MANAGE_ADDRESSES',
    'VIEW_WISHLIST'
];

const actionMap = {
    SIGN_IN: {
        REQUEST: null,
        RECEIVE: null,
        RESET: null
    },
    RESET_SIGN_IN_ERROR: {
        REQUEST: null,
        RECEIVE: null
    },
    SIGN_IN_ERROR: {
        REQUEST: null,
        RECEIVE: null
    },
    RESET_CREATE_ACCOUNT_ERROR: {
        REQUEST: null,
        RECEIVE: null
    },
    CREATE_ACCOUNT_ERROR: {
        REQUEST: null,
        RECEIVE: null
    },
    RESET_PASSWORD: {
        REQUEST: null,
        RECEIVE: null
    },
    CREATE_ACCOUNT: {
        REQUEST: null,
        RECEIVE: null
    },
    UPDATE_WISHLIST: {
        REQUEST: null,
        RECEIVE: null,
        REJECT: null
    },
    ADD_WISHLIST_TO_CART: {
        REQUEST: null,
        RECEIVE: null,
        REJECT: null
    },
    ASSIGN_CART: {
        REQUEST: null,
        RECEIVE: null,
        REJECT: null
    },

    SEND_EMAIL_TO_FRIEND: {
        REQUEST: null,
        RECEIVE: null,
        REJECT: null
    }
};

export default createActions(actionMap, ...actionTypes, { prefix });
