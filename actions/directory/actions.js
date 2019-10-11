import { createActions } from 'redux-actions';

const prefix = 'DIRECTORY';
const actionTypes = ['GET_COUNTRIES','GET_DIRECTORY_CONFIG'];

export default createActions(...actionTypes, { prefix });
