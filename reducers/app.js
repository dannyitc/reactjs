import { handleActions } from 'redux-actions';

import actions from 'src/actions/app';

export const name = 'app';

const initialState = {
    drawer: null,
    hasBeenOffline: !navigator.onLine,
    isOnline: navigator.onLine,
    overlay: false,
    searchOpen: false,
    customerLinksOpen: false,
    query: '',
    pending: {},
    openCustomerPopup: false,
    formType: null,
    showA2HSPopup: /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) && !('standalone' in window.navigator && (window.navigator.standalone))
};

const reducerMap = {
    [actions.toggleDrawer]: (state, { payload }) => {
        return {
            ...state,
            drawer: payload,
            overlay: !!payload
        };
    },
    [actions.toggleSearch]: state => {
        return {
            ...state,
            searchOpen: !state.searchOpen,
            customerLinksOpen: false,
            drawer: null
        };
    },
    [actions.toggleCustomerMenu]: state => {
        return {
            ...state,
            customerLinksOpen: !state.customerLinksOpen,
            searchOpen: false,
            drawer: null
        };
    },
    [actions.executeSearch]: (state, { payload }) => {
        return {
            ...state,
            query: payload,
            autocompleteOpen: false
        };
    },
    [actions.setOnline]: state => {
        return {
            ...state,
            isOnline: true
        };
    },
    [actions.setOffline]: state => {
        return {
            ...state,
            isOnline: false,
            hasBeenOffline: true
        };
    },
    [actions.togglePopup]: (state, { payload }) => {
        return {
            ...state,
            formType: payload,
            openCustomerPopup: !!payload,
            customerLinksOpen: false
        };
    },
    [actions.toggleCart]: state => {
        return {
            ...state,
            customerLinksOpen: false,
            searchOpen: false
        };
    },
};

export default handleActions(reducerMap, initialState);
