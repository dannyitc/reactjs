import { createActions } from 'redux-actions';

const prefix = 'CATALOG';

const actionMap = {
    GET_ALL_CATEGORIES: {
        REQUEST: null,
        RECEIVE: null
    },
    SET_CURRENT_PAGE: {
        REQUEST: null,
        RECEIVE: null
    },
    SET_PREV_PAGE_TOTAL: {
        REQUEST: null,
        RECEIVE: null
    },
    UPDATE_CHOSEN_FILTER_OPTIONS: null,
    ADD_REVIEW: {
        REQUEST: null,
        RECEIVE: null
    },
    SET_LIMIT: {
        REQUEST: null,
        RECEIVE: null
    },
    SET_CURRENT_SORT_BY: {
        REQUEST: null,
        RECEIVE: null
    },
    SET_CURRENT_DIRECTION: {
        REQUEST: null,
        RECEIVE: null
    },
    UPDATE_ORIGIN_FILTER_OPTIONS: null,
    UPDATE_CURRENT_FILTER_OPTIONS: null,
    SET_CURRENT_CATEGORY_ID: {
        REQUEST: null,
        RECEIVE: null,
        REJECT: null
    },
    SET_CURRENT_ROOT_ID: {
        REQUEST: null,
        RECEIVE: null
    },
    OPEN_COMPARE_POPUP: {
        REQUEST: null,
        RECEIVE: null
    },
    OPEN_SHARE_POPUP: {
        REQUEST: null,
        RECEIVE: null
    },
    GET_PRODUCT_CONFIG: {
        REQUEST: null,
        RECEIVE: null,
        REJECT: null
    }
};

export default createActions(actionMap, { prefix });
