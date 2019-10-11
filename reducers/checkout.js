import { handleActions } from 'redux-actions';
import get from 'lodash/get';
import { Util } from '@magento/peregrine';
import actions from 'src/actions/checkout';

const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const name = 'checkout';

const initialState = {
    availableShippingMethods: [],
    availablePaymentMethods: [],
    totals: {},
    billingAddress: null,
    editing: null,
    paymentCode: '',
    shippingAddress: null,
    shippingMethod: '',
    shippingTitle: '',
    step: 'form',
    submitting: false,
    isAddressIncorrect: false,
    incorrectAddressMessage: '',
    newAddress: null,
    checkoutStep: 1,
    storeConfig: {
        enable_agreements: true,
        max_items_display_count: 10
    }
};

const reducerMap = {
    [actions.begin]: state => {
        const storedBillingAddress = storage.getItem('billing_address');
        const storedPaymentMethod = storage.getItem('paymentMethod');
        const storedShippingAddress = storage.getItem('shipping_address');
        const storedNewAddress = storage.getItem('newAddress');
        let storedShippingMethod = storage.getItem('shippingMethod');

        return {
            ...state,
            billingAddress: storedBillingAddress,
            paymentCode: storedPaymentMethod && storedPaymentMethod.code,
            shippingAddress: storedShippingAddress,
            shippingMethod:
                storedShippingMethod && storedShippingMethod.carrier_code,
            shippingTitle:
                storedShippingMethod && storedShippingMethod.carrier_title,
            editing: null,
            step: 'form',
            newAddress: storedNewAddress,
            checkoutStep: storedShippingMethod ? 3 : (storedShippingAddress ? 2 : 1)
        };
    },
    [actions.edit]: (state, { payload }) => {
        return {
            ...state,
            checkoutStep: payload,
            incorrectAddressMessage: ''
        };
    },
    [actions.billingAddress.submit]: state => state,
    [actions.billingAddress.accept]: (state, { payload }) => {
        return {
            ...state,
            billingAddress: payload
        };
    },
    [actions.billingAddress.reject]: state => state,
    [actions.getShippingMethods.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            availableShippingMethods: payload.map(method => ({
                ...method,
                code: method.carrier_code,
                title: method.carrier_title
            }))
        };
    },
    [actions.shippingAddress.submit]: state => {
        return {
            ...state,
            submitting: true
        };
    },
    [actions.shippingAddress.accept]: (state, { payload }) => {
        return {
            ...state,
            editing: null,
            shippingAddress: payload,
            step: 'form',
            submitting: false,
            isAddressIncorrect: false,
            incorrectAddressMessage: ''
        };
    },
    [actions.shippingAddress.reject]: (state, actionArgs) => {
        const incorrectAddressMessage = get(
            actionArgs,
            'payload.incorrectAddressMessage',
            ''
        );

        return {
            ...state,
            submitting: false,
            isAddressIncorrect: incorrectAddressMessage ? true : false,
            incorrectAddressMessage
        };
    },
    [actions.paymentMethod.submit]: state => {
        return {
            ...state,
            submitting: true
        };
    },
    [actions.paymentMethod.accept]: (state, { payload }) => {
        return {
            ...state,
            editing: null,
            paymentCode: payload.code,
            step: 'form',
            submitting: false
        };
    },
    [actions.paymentMethod.reject]: state => {
        return {
            ...state,
            submitting: false
        };
    },
    [actions.shippingMethod.submit]: state => {
        return {
            ...state,
            submitting: true
        };
    },
    [actions.shippingMethod.accept]: (state, { payload }) => {
        return {
            ...state,
            editing: null,
            shippingMethod: payload.carrier_code,
            shippingTitle: payload.carrier_title,
            step: 'form',
            submitting: false,
            isAddressIncorrect: false,
            incorrectAddressMessage: ''
        };
    },
    [actions.shippingMethod.reject]: state => {
        return {
            ...state,
            submitting: false
        };
    },
    [actions.order.submit]: state => {
        return {
            ...state,
            submitting: true
        };
    },
    [actions.order.accept]: state => {
        return {
            ...state,
            editing: null,
            step: 'receipt',
            submitting: false
        };
    },
    [actions.order.reject]: state => {
        return {
            ...state,
            submitting: false
        };
    },
    [actions.reset]: () => initialState,
    [actions.shippingInformation.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            availablePaymentMethods: payload.payment_methods,
            totals: payload.totals
        };
    },
    [actions.addNew]: (state, { payload }) => {
        return {
            ...state,
            newAddress: payload
        };
    },

    [actions.getCheckoutConfig.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            storeConfig: {
                ...state.storeConfig,
                enable_agreements: payload.enable_agreements,
                max_items_display_count: payload.max_items_display_count
            }
        };
    },

    [actions.getAddressConfig.receive]: (state, { payload, error }) => {
        if (error) {
            return state;
        }

        return {
            ...state,
            addressConfig: payload
        };
    }
};

export default handleActions(reducerMap, initialState);
