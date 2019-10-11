import { createActions } from 'redux-actions';

const prefix = 'APP';
const actionTypes = [
    'TOGGLE_DRAWER',
    'SET_ONLINE',
    'SET_OFFLINE',
    'TOGGLE_SEARCH',
    'TOGGLE_CUSTOMER_MENU',
    'TOGGLE_CART',
    'EXECUTE_SEARCH',
    'MARK_ERROR_HANDLED',
    'TOGGLE_POPUP'
];

export default createActions(...actionTypes, { prefix });
