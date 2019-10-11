import { RestApi } from '@magento/peregrine';

import { closeDrawer, toggleDrawer } from 'src/actions/app';
import checkoutActions from 'src/actions/checkout';
import actions from './actions';
import appActions from 'src/actions/app';
import { Util } from '@magento/peregrine';

import * as api from './api';
import authorizationService from 'src/services/authorization';

const { request } = RestApi.Magento2;
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();
import { toast } from "react-toastify";

const createCartRequest = () => async dispatch => {
    dispatch(actions.getCart.request());

    try {
        const id = await api.createCart();

        // write to storage in the background
        saveCartId(id);
        dispatch(actions.getCart.receive(id));
    } catch (error) {
        dispatch(actions.getCart.receive(error));
    }
};

export const createCart = () =>
    async function thunk(dispatch, getState) {
        const { cart } = getState();

        // if a cart already exists, exit
        if (cart.cartId) {
            return;
        }

        // reset the checkout workflow
        // in case the user has already completed an order this session
        dispatch(checkoutActions.reset());

        const cartId = await retrieveCartId();

        // if a cart exists in storage, act like we just received it
        if (cartId) {
            dispatch(actions.getCart.receive(cartId));
            return;
        }

        return dispatch(createCartRequest());
    };

export const goToCartPage = history => async dispatch => {
    await dispatch(getCartDetails());
    dispatch(toggleDrawer(null));
    history.push('/cart.html');
};

export const recreateCart = () => async dispatch => {
    await dispatch(resetCart());

    return dispatch(createCart());
};

export const resetCart = () =>
    async function thunk(...args) {
        const [dispatch] = args;

        await clearCartId();

        dispatch(actions.cart.reset());
    };

export const addItemToCart = (payload = {}) => {
    const { item, quantity } = payload;
    const writingImageToCache = writeImageToCache(item);
    const name = payload.productType == 'ConfigurableProduct' ? payload.parentName : payload.item.name;

    return async function thunk(dispatch, getState) {
        await writingImageToCache;
        dispatch(actions.addItem.request(payload));

        try {
            const { cart, user } = getState();
            const { cartId } = cart;

            const { isSignedIn, currentUser } = user;
            const { items_qty } = cart.details;

            if (isSignedIn && !items_qty && cartId) {
                const addressData = {
                    address: {
                        firstname: currentUser.firstname,
                        lastname: currentUser.lastname,
                        email: currentUser.email,
                    },
                }

                await request('/rest/V1/carts/mine/billing-address', {
                    method: 'POST',
                    body: JSON.stringify(addressData)
                });
            }

            if (!cartId) {
                const missingGuestCartError = new Error(
                    'Missing required information: cartId'
                );
                missingGuestCartError.noGuestCartId = true;
                throw missingGuestCartError;
            }

            const cartItem = await api.addItemToCart(cartId, payload);

            dispatch(actions.addItem.receive({ cartItem, item, quantity }));
        } catch (error) {
            const { response, noGuestCartId } = error;


            // check if the cart has expired
            if (noGuestCartId || (response && response.status === 404)) {
                // if so, then delete the cached ID...
                // in contrast to the save, make sure storage deletion is
                // complete before dispatching the error--you don't want an
                // upstream action to try and reuse the known-bad ID.
                await clearCartId();
                // then create a new one
                await dispatch(createCart());
                // then retry this operation
                return thunk(...arguments);
            }
            toast.error("Something's wrong.Please try again");
            dispatch(actions.addItem.receive(error));
            return;
        }
        toast.success(`You have added ${name} to your shopping cart.`);
        Promise.all([
            dispatch(toggleDrawer('cart')),
            dispatch(getCartDetails({ forceRefresh: true }))
        ]);
    };
};

export const updateItemInCart = (payload = {}, targetItemId) => {
    const { item, options, parentSku, productType, quantity } = payload;

    return async function thunk(dispatch, getState) {
        dispatch(actions.updateItem.request(payload));

        try {
            const { cart } = getState();
            const { cartId } = cart;

            if (!cartId) {
                const missingGuestCartError = new Error(
                    'Missing required information: cartId'
                );
                missingGuestCartError.noGuestCartId = true;
                throw missingGuestCartError;
            }

            // TODO: change to GraphQL mutation
            // for now, manually transform the payload for REST
            const itemPayload = {
                qty: quantity,
                sku: item.sku,
                name: item.name,
                quote_id: cartId
            };

            if (productType === 'ConfigurableProduct') {
                Object.assign(itemPayload, {
                    sku: parentSku,
                    product_type: 'configurable',
                    product_option: {
                        extension_attributes: {
                            configurable_item_options: options
                        }
                    }
                });
            }

            const endpoint = authorizationService.isSignedIn()
                ? `/rest/V1/carts/mine/items/${targetItemId}`
                : `/rest/V1/guest-carts/${cartId}/items/${targetItemId}`;

            const cartItem = await request(
                endpoint,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        cartItem: itemPayload
                    })
                }
            );
            dispatch(actions.updateItem.receive({ cartItem, item, quantity }));
            toast.success('You have updated cart successfully.');
            Promise.all([
                dispatch(toggleDrawer('cart')),
                dispatch(getCartDetails({ forceRefresh: true }))
            ]);
        } catch (error) {
            dispatch(actions.updateItem.receive(error));
            toast.error("Something's wrong.Please try again");
            return;
        }
        dispatch(closeOptionsDrawer());
    };
};

export const updateCart = (payload = {}) => {

    return async function thunk(dispatch, getState) {
        dispatch(actions.updateCart.request(payload));

        try {
            const { cart } = getState();
            const { cartId } = cart;

            if (!cartId) {
                const missingGuestCartError = new Error(
                    'Missing required information: cartId'
                );
                missingGuestCartError.noGuestCartId = true;
                throw missingGuestCartError;
            }

            const endpoint = authorizationService.isSignedIn()
                ? `/rest/V1/carts/mine/update`
                : `/rest/V1/guest-carts/update`;

            await request(
                endpoint,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        items: payload,
                        cartId: cartId
                    })
                }
            );
            dispatch(actions.updateCart.receive());
            toast.success('You have updated cart successfully.');
            Promise.all([
                dispatch(toggleDrawer('cart')),
                dispatch(getCartDetails({ forceRefresh: true }))
            ]);
        } catch (error) {
            dispatch(actions.updateCart.receive(error));
            toast.error("Something's wrong.Please try again");
            return;
        }
        dispatch(closeOptionsDrawer());
    };
};

export const removeItemFromCart = payload => {
    const { item } = payload;

    return async function thunk(dispatch, getState) {
        dispatch(actions.removeItem.request(payload));

        try {
            const { cart } = getState();
            const { cartId } = cart;
            const cartItemCount = cart.details ? cart.details.items_count : 0;

            if (!cartId) {
                const missingGuestCartError = new Error(
                    'Missing required information: cartId'
                );
                missingGuestCartError.noGuestCartId = true;
                throw missingGuestCartError;
            }

            const cartItem = await api.removeCartItem({
                cartId: cartId,
                itemId: item.item_id
            });
            // When removing the last item in the cart, perform a reset
            // to prevent a bug where the next item added to the cart has
            // a price of 0
            if (cartItemCount == 1) {
                await clearCartId();
            }

            dispatch(
                actions.removeItem.receive({ cartItem, item, cartItemCount })
            );
        } catch (error) {
            dispatch(actions.removeItem.receive(error));
            toast.error("Something's wrong.Please try again");
            return;
        }
        toast.success('You have remove item from cart successfully.');
        dispatch(getCartDetails({ forceRefresh: true }));
    };
};

export const openOptionsDrawer = () => async dispatch =>
    dispatch(actions.openOptionsDrawer());

export const closeOptionsDrawer = () => async dispatch =>
    dispatch(actions.closeOptionsDrawer());

export const getShippingMethods = (address) => {
    return async function thunk(dispatch, getState) {
        const { cart } = getState();
        const { cartId } = cart;

        try {
            // if there isn't a cart, create one
            // then retry this operation
            if (!cartId) {
                await dispatch(createCart());
                return thunk(...arguments);
            }

            dispatch(actions.getShippingMethods.request(cartId));

            const apiLink = authorizationService.isSignedIn() ? 'carts/mine' : `guest-carts/${cartId}`;
            const response = await request(
                `/rest/V1/${apiLink}/estimate-shipping-methods`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        address: address ? address : {
                            country_id: 'US',
                            postcode: null
                        }
                    })
                }
            );

            dispatch(actions.getShippingMethods.receive(response));
        } catch (error) {
            const { response } = error;

            dispatch(actions.getShippingMethods.receive(error));

            // check if the cart has expired
            if (response && response.status === 404) {
                // if so, clear it out, get a new one, and retry.
                await clearCartId();
                await dispatch(createCart());
                return thunk(...arguments);
            }
        }
    };
};

export const getCartDetails = (payload = {}) => {
    const { forceRefresh } = payload;

    return async function thunk(dispatch, getState) {
        const { cart } = getState();
        const { cartId } = cart;
        dispatch(actions.getDetails.request(cartId));

        if (!cartId) {
            await dispatch(createCart());
            return thunk(...arguments);
        }

        try {
            const [
                imageCache,
                details,
                totals
            ] = await Promise.all([
                retrieveImageCache(),
                api.fetchCartPart({ cartId: cartId, forceRefresh }),
                api.fetchCartPart({
                    cartId: cartId,
                    forceRefresh,
                    subResource: 'totals'
                })
            ]);

            const { items } = details;

            if (imageCache && Array.isArray(items) && items.length) {
                const validTotals = totals && totals.items;
                items.forEach(item => {
                    item.image = item.image || imageCache[item.sku] || {};

                    let options = [];
                    if (validTotals) {
                        const matchingItem = totals.items.find(
                            t => t.item_id === item.item_id
                        );
                        if (matchingItem && matchingItem.options) {
                            options = JSON.parse(matchingItem.options);
                        }
                    }
                    item.options = options;
                });
            }

            dispatch(actions.getDetails.receive({ details, totals}));
        } catch (error) {
            const { response } = error;

            dispatch(actions.getDetails.receive(error));

            if (response && response.status === 404) {
                await clearCartId();
                await dispatch(createCart());
                return thunk(...arguments);
            }
        }
    };
};

export const toggleCart = () =>
    async function thunk(dispatch, getState) {
        const { app, cart } = getState();

        // ensure state slices are present
        if (!app || !cart) {
            return;
        }

        // if the cart drawer is open, close it
        if (app.drawer === 'cart') {
            return dispatch(closeDrawer());
        }

        dispatch(appActions.toggleCart());

        // otherwise open the cart and load its contents
        await Promise.all([
            dispatch(toggleDrawer('cart')),
            dispatch(getCartDetails())
        ]);
    };

export const removeGuestCart = () =>
    async function thunk(...args) {
        const [dispatch, getState] = args;
        const { cart } = getState();
        // ensure state slices are present
        if (!cart) {
            return;
        }
        if (cart['cartId']) {
            dispatch({
                type: 'REMOVE_GUEST_CART'
            });
        }
    };

/* helpers */

export async function getCartId(dispatch, getState) {
    const { cart } = getState();
    // reducers may be added asynchronously
    if (!cart) {
        return null;
    }
    // create a cart if one hasn't been created yet
    if (!cart.cartId) {
        await dispatch(createCart());
    }
    // retrieve app state again
    return getState().cart.cartId;
}

export async function retrieveCartId() {
    return storage.getItem('cartId');
}

export async function saveCartId(id) {
    return storage.setItem('cartId', id);
}

export async function clearCartId() {
    return storage.removeItem('cartId');
}

async function retrieveImageCache() {
    return storage.getItem('imagesBySku') || {};
}

async function saveImageCache(cache) {
    return storage.setItem('imagesBySku', cache);
}

async function writeImageToCache(item = {}) {
    const { media_gallery_entries: media, sku, small_image } = item;

    if (sku) {
        const image = media && (media.find(m => m.position === 1) || media[0]);

        if (image) {
            const imageCache = await retrieveImageCache();

            // if there is an image and it differs from cache
            // write to cache and save in the background
            if (imageCache[sku] !== image) {
                imageCache[sku] = image;
                saveImageCache(imageCache);

                return image;
            }
        }
        if (small_image) {
            const imageCache = await retrieveImageCache();
            const imageData = {
                file: small_image
            }
            if (imageCache[sku] !== imageData) {
                imageCache[sku] = imageData;
                saveImageCache(imageCache);

                return imageData;
            }
        }
    }
}
