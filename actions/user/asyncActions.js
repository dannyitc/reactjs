import { RestApi } from '@magento/peregrine';
import { Util } from '@magento/peregrine';
import { recreateCart, getCartDetails } from 'src/actions/cart';
import { closePopup } from 'src/actions/app';
import { clearStorageData } from 'src/actions/checkout';
import authorizationService from 'src/services/authorization';
import graphqlService from 'src/services/graphql';
import { refresh } from 'src/util/router-helpers';
import actions from './actions';
import { toast } from "react-toastify";

const { request } = RestApi.Magento2;
const { graphql } = graphqlService;

const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const signIn = payload =>
    async function thunk(...args) {
        const [dispatch, getState] = args;

        dispatch(actions.resetSignInError.request());
        dispatch(actions.signIn.request());

        const { cart } = getState();
        const { cartId } = cart;

        try {
            const body = {
                username: payload.username,
                password: payload.password
            };

            const response = await request(
                '/rest/V1/integration/customer/token',
                {
                    method: 'POST',
                    body: JSON.stringify(body)
                }
            );

            authorizationService.setAuthorizationToken(response);

            const userDetails = await request('/rest/V1/customers/me', {
                method: 'GET'
            });

            await request('/rest/V1/tigren/customer/login', {
                method: 'POST'
            });

            dispatch(actions.signIn.receive(userDetails));

            if (!payload.isNewUser) toast.success('You have logged in successfully.');

            clearStorageData();
            await dispatch(recreateCart());
            if (cartId) await dispatch(assignGuestCart(cartId));
            await dispatch(getCartDetails());
            await dispatch(closePopup());
        } catch (error) {
            dispatch(actions.signIn.receive(error));
            toast.error("Something wrong.Please try again");
        }
    };

export const signOut = history => async dispatch => {
    setToken(null);
    dispatch(actions.signIn.reset());
    await request(
        '/rest/V1/tigren/customer/logout',
        {
            method: 'POST'
        }
    );
    await dispatch(recreateCart());
    history.push('');
    refresh({ history });
    clearStorageData();
    await dispatch(closePopup());
};

export const goToAccountPage = history => async dispatch => {
    await dispatch(closePopup());
    history.push('/customer.html');
    dispatch(actions.viewDashboard());
};

export const viewProfilePage = history => async dispatch => {
    await dispatch(closePopup());
    history.push('/customer.html');
    dispatch(actions.viewProfile());
};

export const viewOrderHistory = (history, orderId) => async dispatch => {
    await dispatch(closePopup());
    history.push('/customer.html');
    dispatch(actions.manageOrders(orderId));
};

export const manageAddressesPage = history => async dispatch => {
    await dispatch(closePopup());
    history.push('/customer.html');
    dispatch(actions.manageAddresses());
};

export const goToWishListPage = history => async dispatch => {
    await dispatch(closePopup());
    history.push('/customer.html');
    dispatch(actions.viewWishlist());
};

export const getUserDetails = () =>
    async function thunk(...args) {
        const [dispatch, getState] = args;
        const { user } = getState();
        if (user.isSignedIn) {
            dispatch(actions.resetSignInError.request());
            try {
                const userDetails = await request('/rest/V1/customers/me', {
                    method: 'GET'
                });
                dispatch(actions.signIn.receive(userDetails));
            } catch (error) {
                dispatch(actions.signInError.receive(error));
            }
        }
    };

export const createNewUserRequest = accountInfo =>
    async function thunk(...args) {
        const [dispatch] = args;

        dispatch(actions.resetCreateAccountError.request());
        dispatch(actions.createAccount.request());

        try {
            await request('/rest/V1/customers', {
                method: 'POST',
                body: JSON.stringify(accountInfo)
            });
            // TODO: merge the guest cart with the user cart
            await dispatch(
                signIn({
                    username: accountInfo.customer.email,
                    password: accountInfo.password,
                    isNewUser: true
                })
            );
            toast.success('You have created new account successfully.');
            // TODO: assign the guest cart to the user
        } catch (error) {
            dispatch(actions.createAccount.receive(error));
            toast.error("Something wrong.Please try again");
        }
    };

export const createAccount = accountInfo => async dispatch => {
    /*
     * Server validation error is handled in handleCreateAccount.
     * We set createAccountError in Redux and throw error again
     * to notify redux-thunk action which dispatched handleCreateAccount action.
     */
    try {
        await dispatch(createNewUserRequest(accountInfo));
    } catch (e) { }
};

export const assignGuestCartToCustomer = () =>
    async function thunk(...args) {
        const [dispatch, getState] = args;

        dispatch(actions.assignCart.request());

        const { user, cart } = getState();
        const { cartId } = cart;
        const { currentUser } = user;
        if (!cartId) {
            return;
        }
        try {
            const payload = {
                customerId: currentUser.id,
                storeId: currentUser.store_id
            };
            // TODO: Check if guestCartId exists
            await request(`/rest/V1/guest-carts/${cartId}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            dispatch(actions.assignCart.receive());
        } catch (error) {
            dispatch(actions.assignCart.reject());
        }
    };

export const resetPassword = ({ email }) =>
    async function thunk(...args) {
        const [dispatch] = args;
        const payload = {
            email,
            baseUrl: location.origin
        }
        dispatch(actions.resetPassword.request(email));
        const response = await request(`/rest/V1/customer/resetPassword`, {
            method: 'Post',
            body: JSON.stringify(payload)
        });
        dispatch(actions.resetPassword.receive());
        await dispatch(closePopup());
        if(response){
            toast.success(`If there is an account associated with ${email} you will receive an email with a link to reset your password.`);
        }else{
            toast.error('We received too many requests for password resets.')
        }
        
    };

export const completePasswordReset = email => async dispatch =>
    dispatch(actions.completePasswordReset(email));

async function setToken(token) {
    // TODO: Get correct token expire time from API
    storage.setItem('signin_token', token, 36000);
}

export const updateWishlist = (payload) =>
    async function thunk(...args) {
        const [dispatch] = args;
        dispatch(actions.updateWishlist.request());
        try {

            // TODO: Check if guestCartId exists
            await request('/rest/V1/tigren/wishlist/mine/update', {
                method: 'POST',
                body: JSON.stringify({
                    wishlistUpdate: payload
                })
            });
            dispatch(actions.updateWishlist.receive());

            toast.success('You have updated your wishlist successfully.');
        } catch (error) {
            // TODO: Handle error
            dispatch(actions.updateWishlist.reject());
            toast.error("Something's wrong.Please try again.");
        }
    };

export const sendEmailToFriend = (payload) =>
    async function thunk(...args) {
        const [dispatch] = args;
        dispatch(actions.sendEmailToFriend.request());
        try {

            // TODO: Check if guestCartId exists
            await request('/rest/V1/tigren/catalog/sendemail', {
                method: 'POST',
                body: JSON.stringify({
                    sendData: payload
                })
            });
            dispatch(actions.sendEmailToFriend.receive());
            toast.success('The link to a friend was sent.');
        } catch (error) {
            // TODO: Handle error
            console.log(error);
            dispatch(actions.sendEmailToFriend.reject());
            toast.error("Something's wrong.Please try again.");
        }
    };

export const assignGuestCart = (cartId) =>
    async function thunk(...args) {
        const [dispatch] = args;
        dispatch(actions.assignCart.request());
        if (!cartId) {
            return;
        }
        try {
            const params = {
                query: `
                    mutation assignGuestCart($cartId: String!) {
                        assignGuestCart(cartId: $cartId)
                    }
                `.trim(),
                variables: {
                    cartId: cartId
                }
            }
            await graphql(params);
            dispatch(actions.assignCart.receive());
        } catch (error) {
            // TODO: Handle error
            dispatch(actions.assignCart.reject());
            console.log(error);
        }
    };