import { handleActions } from 'redux-actions';

import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;

const storage = new BrowserPersistence();

import actions from 'src/actions/user';

export const name = 'user';

const isSignedIn = () => !!storage.getItem('signin_token');

const initialState = {
    currentUser: {
        email: '',
        firstname: '',
        lastname: '',
        addresses: []
    },
    isSignedIn: isSignedIn(),
    forgotPassword: {
        email: '',
        isInProgress: false
    },
    signInError: {},
    selectedTabIndex: null,
    isViewOrderById: false
};

const reducerMap = {
    [actions.signIn.receive]: (state, { payload, error }) => {
        if (error) {
            return initialState;
        }

        return {
            ...state,
            isSignedIn: true,
            currentUser: payload
        };
    },
    [actions.signInError.receive]: (state, { payload }) => {
        return {
            ...state,
            isSignedIn: false,
            signInError: payload
        };
    },
    [actions.createAccountError.receive]: (state, { payload }) => {
        return {
            ...state,
            createAccountError: payload
        };
    },
    [actions.resetSignInError.receive]: state => {
        return {
            ...state,
            signInError: {}
        };
    },
    [actions.resetCreateAccountError.receive]: state => {
        return {
            ...state,
            createAccountError: {}
        };
    },
    [actions.resetPassword.request]: (state, { payload }) => {
        return {
            ...state,
            forgotPassword: {
                email: payload,
                isInProgress: true
            }
        };
    },
    // TODO: handle the reset password response from the API.
    [actions.resetPassword.receive]: state => state,
    [actions.completePasswordReset]: (state, { payload }) => {
        const { email } = payload;

        return {
            ...state,
            forgotPassword: {
                email,
                isInProgress: false
            }
        };
    },
    [actions.signIn.reset]: () => {
        return {
            ...initialState,
            isSignedIn: isSignedIn()
        };
    },
    [actions.viewDashboard]: (state, { error }) => {
        if (error) {
            return initialState;
        }

        return {
            ...state,
            selectedTabIndex: 0
        };
    },
    [actions.viewProfile]: (state, { error }) => {
        if (error) {
            return initialState;
        }

        return {
            ...state,
            selectedTabIndex: 1
        };
    },
    [actions.manageOrders]: (state, { error }) => {
        if (error) {
            return initialState;
        }

        return {
            ...state,
            selectedTabIndex: 2,
            isViewOrderById: true
        };
    },
    [actions.manageAddresses]: (state, { error }) => {
        if (error) {
            return initialState;
        }

        return {
            ...state,
            selectedTabIndex: 3
        };
    },
    [actions.viewWishlist]: (state, { error }) => {
        if (error) {
            return initialState;
        }

        return {
            ...state,
            selectedTabIndex: 4
        };
    }
};

export default handleActions(reducerMap, initialState);
