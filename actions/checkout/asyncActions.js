import { RestApi, Util } from '@magento/peregrine';

import { closeDrawer } from 'src/actions/app';
import { clearCartId } from 'src/actions/cart';
import { createCart } from 'src/actions/cart';
import checkoutReceiptActions from 'src/actions/checkoutReceipt';
import actions from './actions';
import cartActions from '../cart/actions';
import authorizationService from 'src/services/authorization';
import graphqlService from 'src/services/graphql';
import { fetchCartPart } from 'src/actions/cart/api';

const { graphql } = graphqlService;
const { request } = RestApi.Magento2;
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const beginCheckout = () =>
    async function thunk(dispatch) {
        await dispatch(resetCheckout());
        dispatch(actions.begin());
        dispatch(getShippingMethods());
        dispatch(getPaymentMethods());
        // dispatch(getCheckoutConfig());
    };

export const cancelCheckout = () =>
    async function thunk(dispatch) {
        dispatch(actions.reset());
    };

export const resetCheckout = () =>
    async function thunk(dispatch) {
        await dispatch(closeDrawer());
        dispatch(actions.reset());
    };

export const editOrder = step =>
    async function thunk(dispatch) {
        if (step == 1) {
            await clearShippingMethod();
            await clearPaymentMethod();
        }
        if (step == 2) {
            await clearPaymentMethod();
        }
        dispatch(actions.edit(step));
    };

export const getShippingMethods = (address) => {
    return async function thunk(dispatch, getState) {
        const { cart } = getState();
        const { cartId } = cart;

        try {
            if (!cartId) {
                await dispatch(createCart());
                return thunk(...arguments);
            }

            dispatch(actions.getShippingMethods.request(cartId));

            const apiLink = authorizationService.isSignedIn() ? 'carts/mine' : `guest-carts/${cartId}`;
            const shippingAddress = await retrieveShippingAddress();
            const addressData = address ? address : (shippingAddress ? shippingAddress : null);
            const response = await request(
                `/rest/V1/${apiLink}/estimate-shipping-methods`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        address: {
                            country_id: addressData ? addressData.country_id : 'US',
                            postcode: addressData ? addressData.postcode : null
                        }
                    })
                }
            );

            dispatch(actions.getShippingMethods.receive(response));
        } catch (error) {
            dispatch(actions.getShippingMethods.receive(error));
            if (response && response.status === 404) {
                return;
            }
        }
    };
};

export const submitPaymentMethodAndBillingAddress = payload =>
    async function thunk(dispatch, getState) {
        submitBillingAddress(payload.billingAddress)(
            dispatch,
            getState
        );
        submitPaymentMethod(payload.paymentMethod)(
            dispatch,
            getState
        );
    };

export const submitBillingAddress = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.billingAddress.submit(payload));

        const { cart, directory } = getState();

        const { cartId } = cart;
        if (!cartId) {
            throw new Error('Missing required information: cartId');
        }

        let desiredBillingAddress = payload;
        if (!payload.sameAsShippingAddress) {
            const { countries } = directory;
            try {
                desiredBillingAddress = formatAddress(payload, countries);
            } catch (error) {
                dispatch(actions.billingAddress.reject(error));
                return;
            }
        }

        await saveBillingAddress(desiredBillingAddress);
        dispatch(actions.billingAddress.accept(desiredBillingAddress));
    };

export const submitPaymentMethod = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.paymentMethod.submit(payload));

        const { cart } = getState();

        const { cartId } = cart;
        if (!cartId) {
            throw new Error('Missing required information: cartId');
        }

        await savePaymentMethod(payload);
        dispatch(actions.paymentMethod.accept(payload));
    };

export const submitShippingAddress = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.shippingAddress.submit(payload));
        const { cart, directory } = getState();

        const { cartId } = cart;
        if (!cartId) {
            throw new Error('Missing required information: cartId');
        }

        const { countries } = directory;
        let { formValues: address } = payload;
        try {
            address = formatAddress(address, countries);
        } catch (error) {
            dispatch(
                actions.shippingAddress.reject({
                    incorrectAddressMessage: error.message
                })
            );
            return null;
        }
        await dispatch(getShippingMethods({
            country_id: address.country_id ? address.country_id : 'US',
            postcode: address.postcode
        }));
        await saveShippingAddress(address);
        await dispatch(editOrder(2));
        dispatch(actions.shippingAddress.accept(address));
    };

export const submitShippingMethod = payload =>
    async function thunk(dispatch, getState) {
        dispatch(actions.shippingMethod.submit(payload));

        const { cart } = getState();
        const { cartId } = cart;
        if (!cartId) {
            throw new Error('Missing required information: cartId');
        }

        const desiredShippingMethod = payload.formValues.shippingMethod;
        await saveShippingMethod(desiredShippingMethod);

        const shipping_address = await retrieveShippingAddress();
        const shippingPayload = Object.assign(shipping_address, {
            customerAddressId: shipping_address.id,
            countryId: shipping_address.country_id,
            customerId: shipping_address.customer_id
        });
        delete shippingPayload.id;
        delete shippingPayload.country_id;
        delete shippingPayload.customer_id;

        let billingPayload = Object.assign({}, shippingPayload);
        billingPayload.saveInAddressBook = 0;

        try {
            const apiLink = authorizationService.isSignedIn() ? 'carts/mine' : `guest-carts/${cartId}`;
            const response = await request(
                `/rest/V1/${apiLink}/shipping-information`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        addressInformation: {
                            shipping_address: shippingPayload,
                            billing_address: billingPayload,
                            shipping_carrier_code: desiredShippingMethod.carrier_code,
                            shipping_method_code: desiredShippingMethod.method_code
                        }
                    })
                }
            );
            await dispatch(editOrder(3));
            dispatch(cartActions.getDetails.receive(response));
            dispatch(actions.shippingMethod.accept(desiredShippingMethod));
        } catch (error) {
            const { response } = error;

            dispatch(actions.shippingInformation.receive(error));

            // check if the cart has expired
            if (response && response.status === 404) {
                // if so, clear it out, get a new one, and retry.
                console.log(response);
            }
        }
    };

export const submitOrder = (formValue) =>
    async function thunk(dispatch, getState) {
        dispatch(actions.order.submit());

        const { cart, directory } = getState();
        const { countries } = directory;
        const { cartId } = cart;
        if (!cartId) {
            throw new Error('Missing required information: cartId');
        }

        let billing_address = formValue.billingAddress;
        const paymentMethod = formValue.paymentMethod;
        const shipping_address = await retrieveShippingAddress();

        if (!billing_address) {
            throw new Error('Missing Billing Address');
        }

        if (billing_address.sameAsShippingAddress) {
            billing_address = shipping_address;
            billing_address.saveInAddressBook = 0;
        } else {
            billing_address = formatAddress(billing_address, countries);
            billing_address.email = shipping_address.email;
        }

        let billingPayload = Object.assign(billing_address, {
            customerAddressId: billing_address.id,
            countryId: billing_address.country_id,
            customerId: billing_address.customer_id
        });
        delete billingPayload.id;
        delete billingPayload.country_id;
        delete billingPayload.customer_id;

        try {

            // POST to payment-information to submit the payment details and billing address,
            // Note: this endpoint also actually submits the order.
            const apiLink = authorizationService.isSignedIn() ? 'carts/mine' : `guest-carts/${cartId}`;
            const orderId = await request(
                `/rest/V1/${apiLink}/payment-information`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        billingAddress: billingPayload,
                        cartId: cartId,
                        email: shipping_address.email,
                        paymentMethod: {
                            method: paymentMethod.code
                        }
                    })
                }
            );

            dispatch(
                checkoutReceiptActions.setOrderInformation(
                    {
                        billing: billingPayload,
                        orderId: orderId
                    }
                )
            );

            // Clear out everything we've saved about this cart from local storage.
            clearStorageData();
            return orderId;
        } catch (error) {
            dispatch(actions.order.reject(error));
        }
    };

export const acceptOrder = (order) =>
    async function thunk(dispatch) {
        await dispatch(
            checkoutReceiptActions.setOrderInformation(
                {
                    order: order
                }
            )
        );
        dispatch(actions.order.accept());
    }

export const createAccount = history => async (dispatch, getState) => {
    const { checkoutReceipt: { billing } } = getState();
    const accountInfo = {
        email: billing.email,
        firstName: billing.firstname,
        lastName: billing.lastname,
    }
    await dispatch(resetCheckout());

    history.push(`/create-account?${new URLSearchParams(accountInfo)}`);
};

export const continueShopping = history => async dispatch => {
    await dispatch(resetCheckout());

    history.push('/');
};

export const submitNewAddress = payload =>
    async function thunk(dispatch, getState) {

        const { directory } = getState();
        const { countries } = directory;
        let { formValues: address } = payload;
        try {
            address = formatAddress(address, countries);
        } catch (error) {
            console.log(error);
            return null;
        }
        await saveNewAddress(address);
        dispatch(actions.addNew(address));
    };

export const clearStorageData = () => {
    clearAllData();
}
async function clearAllData() {
    await clearBillingAddress();
    await clearCartId();
    await clearPaymentMethod();
    await clearShippingAddress();
    await clearShippingMethod();
    await clearNewAddress();
}

export const getPaymentMethods = () => {
    return async function thunk(dispatch, getState) {
        const { cart } = getState();
        const { cartId } = cart;
        dispatch(cartActions.getDetails.request(cartId));

        if (!cartId) {
            return;
        }

        try {
            const payment_methods = await fetchCartPart({
                cartId: cartId,
                subResource: 'payment-methods'
            })
            dispatch(cartActions.getDetails.receive({ payment_methods }));
        } catch (error) {
            dispatch(cartActions.getDetails.receive(error));
            return;
        }
    };
};

/* helpers */

export function formatAddress(address = {}, countries = []) {
    const country = countries.find(({ id }) => id === address.country_id);
    const { region_id } = address;
    const { available_regions: regions } = country || {};
    const region = regions ? regions.find(({ id }) => id == region_id) : null;
    const regionName = region ? region.name : (typeof address.region === 'object' ? address.region.region : address.region);
    if (address.default_billing) delete address.default_billing;
    if (address.default_shipping) delete address.default_shipping;

    return {
        ...address,
        region_id: region ? region.id : 0,
        region_code: region ? region.code : null,
        region: regionName,
        saveInAddressBook: address.saveInAddressBook ? 1 : 0
    };
}

async function clearBillingAddress() {
    return storage.removeItem('billing_address');
}

async function saveBillingAddress(address) {
    return storage.setItem('billing_address', address);
}

async function clearPaymentMethod() {
    return storage.removeItem('paymentMethod');
}

async function savePaymentMethod(method) {
    return storage.setItem('paymentMethod', method);
}

async function clearShippingAddress() {
    return storage.removeItem('shipping_address');
}

async function retrieveShippingAddress() {
    return storage.getItem('shipping_address');
}

async function saveShippingAddress(address) {
    return storage.setItem('shipping_address', address);
}

async function clearShippingMethod() {
    return storage.removeItem('shippingMethod');
}

async function saveShippingMethod(method) {
    return storage.setItem('shippingMethod', method);
}

async function saveNewAddress(address) {
    return storage.setItem('newAddress', address);
}

async function clearNewAddress() {
    return storage.removeItem('newAddress');
}

export const getCheckoutConfig = () =>
    async function thunk(...args) {
        const [dispatch] = args;

        try {
            const params = {
                query: `
                    query storeConfig {
                        storeConfig {
                            enable_agreements
                            max_items_display_count
                        }
                    }
                `.trim()
            }
            const data = await graphql(params);
            dispatch(actions.getCheckoutConfig.receive(data ? data.storeConfig : {}));
        } catch (error) {
            // TODO: Handle error
            dispatch(actions.getCheckoutConfig.reject());
            console.log(error);
        }
    };

    export const getAddressConfig = () =>
    async function thunk(...args) {
        const [dispatch] = args;

        try {
            const params = {
                query: `
                    query storeConfig {
                        storeConfig {
                            street_lines
                            show_telephone
                            show_company
                        }
                    }
                `.trim()
            }
            const data = await graphql(params);
            dispatch(actions.getAddressConfig.receive(data ? data.storeConfig : {}));
        } catch (error) {
            dispatch(actions.getAddressConfig.reject());
            console.log(error);
        }
    };