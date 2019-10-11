import { handleActions, combineActions } from 'redux-actions';

import actions from 'src/actions/cart';
import checkoutActions from 'src/actions/checkout';

export const name = 'cart';

export const initialState = {
    details: {},
    loading: false,
    cartId: null,
    paymentMethods: [],
    shippingMethods: [],
    totals: {},
    isOptionsDrawerOpen: false,
    isLoading: false,
    isFetching: false,
    currency: 'USD'
};

const reducerMap = {
    [actions.getCart.receive]: (state, { payload, error }) => {
        if (error) {
            return initialState;
        }

        return {
            ...state,
            cartId: payload
        };
    },
    [actions.getDetails.request]: (state, { payload }) => {
        return {
            ...state,
            cartId: payload,
            loading: true
        };
    },
    [actions.getDetails.receive]: (state, { payload, error }) => {
        if (error) {
            return {
                ...state,
                loading: false,
                cartId: null
            };
        }

        return {
            ...state,
            details: payload.details ? payload.details : state.details,
            paymentMethods: payload.payment_methods ? payload.payment_methods : state.payment_methods,
            totals: payload.totals ? payload.totals : state.totals,
            currency: payload.totals ? payload.totals.base_currency_code : state.currency,
            loading:false
        };
    },
    [actions.updateItem.request]: (state, { payload, error }) => {
        if (error) {
            return initialState;
        }
        return {
            ...state,
            ...payload,
            isLoading: true
        };
    },
    [actions.removeItem.receive]: (state, { payload, error }) => {
        if (error) {
            return initialState;
        }
        // If we are emptying the cart, perform a reset to prevent
        // a bug where the next item added to cart would have a price of 0
        if (payload.cartItemCount == 1) {
            return initialState;
        }
        return {
            ...state,
            ...payload
        };
    },
    [actions.openOptionsDrawer]: state => {
        return {
            ...state,
            isOptionsDrawerOpen: true
        };
    },
    [actions.closeOptionsDrawer]: state => {
        return {
            ...state,
            isOptionsDrawerOpen: false,
            isLoading: false
        };
    },
    [actions.getCartData.receive]: state => state,
    [actions.getCartData.request]: state => state,
    [actions.orderSuccess]: state => (payload) => {
        return {
            ...state,
            billingAddress: payload,
        };
    },

    [combineActions(actions.cart.reset, checkoutActions.order.accept)]: () => {
        return initialState;
    }
};

export default handleActions(reducerMap, initialState);
