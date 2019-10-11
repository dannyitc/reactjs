import React, { Component } from 'react';
import { connect } from 'src/drivers';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { array, bool, func, object, oneOf, shape, string } from 'prop-types';
import { createLoadingSelector } from '../../selectors/loading';

import {
    beginCheckout,
    cancelCheckout,
    editOrder,
    submitShippingAddress,
    submitOrder,
    submitPaymentMethodAndBillingAddress,
    submitShippingMethod,
    getShippingMethods,
    submitNewAddress,
    acceptOrder
} from 'src/actions/checkout';

import { isEmptyCartVisible } from 'src/selectors/cart';

import { getCountries, getDirectoryConfig } from 'src/actions/directory';
import { getAddressConfig } from 'src/actions/checkout';

import Flow from './flow';

const hasData = value => !!value;
const isCartReady = cart => cart.details.items_count > 0;
const isCheckoutReady = checkout => {
    const {
        billingAddress,
        paymentData,
        shippingAddress,
        shippingMethod
    } = checkout;

    return [billingAddress, paymentData, shippingAddress, shippingMethod].every(
        hasData
    );
};

export class CheckoutWrapper extends Component {
    static propTypes = {
        history: object,
        beginCheckout: func,
        cancelCheckout: func,
        cart: shape({
            details: object.isRequired,
            cartId: string,
            totals: object
        }).isRequired,
        checkout: shape({
            availableShippingMethods: array,
            editing: oneOf(['address', 'shippingMethod', 'paymentMethod']),
            incorrectAddressMessage: string,
            isAddressIncorrect: bool,
            paymentCode: string,
            paymentData: shape({
                description: string,
                details: shape({
                    cardType: string
                }),
                nonce: string
            }),
            shippingMethod: string,
            shippingTitle: string,
            step: oneOf(['form', 'receipt']).isRequired,
            submitting: bool.isRequired
        }),
        directory: shape({
            countries: array,
            directory_config: object
        }),
        addressConfig: object,
        editOrder: func,
        submitShippingAddress: func,
        submitOrder: func,
        submitPaymentMethodAndBillingAddress: func,
        submitShippingMethod: func
    };

    async componentDidMount() {
        await this.props.beginCheckout();
        this.props.getCountries();
        this.props.getDirectoryConfig();
        this.props.getAddressConfig()
    }

    render() {
        const {
            history,
            beginCheckout,
            cancelCheckout,
            cart,
            checkout,
            directory,
            user,
            editOrder,
            requestOrder,
            submitShippingAddress,
            submitOrder,
            submitPaymentMethodAndBillingAddress,
            submitShippingMethod,
            getShippingMethods,
            submitNewAddress,
            acceptOrder,
            isFetching,
            isCartEmpty,
            addressConfig
        } = this.props;

        // ensure state slices are present
        if (!(cart && checkout)) {
            return null;
        }

        const actions = {
            beginCheckout,
            cancelCheckout,
            editOrder,
            requestOrder,
            submitShippingAddress,
            submitOrder,
            submitPaymentMethodAndBillingAddress,
            submitShippingMethod,
            getShippingMethods,
            submitNewAddress,
            acceptOrder
        };

        const {
            availableShippingMethods,
            availablePaymentMethods,
            paymentData,
            shippingAddress,
            shippingMethod,
            newAddress
        } = checkout;

        const miscProps = {
            availableShippingMethods,
            availablePaymentMethods,
            hasPaymentMethod: hasData(paymentData),
            hasShippingAddress: hasData(shippingAddress),
            hasShippingMethod: hasData(shippingMethod),
            isCartReady: isCartReady(cart),
            isCheckoutReady: isCheckoutReady(checkout),
            newAddress: newAddress,
            isFetching: isFetching,
            isCartEmpty: isCartEmpty
        };

        const flowProps = { history, actions, cart, checkout, directory, user, ...miscProps, addressConfig };

        return <Flow {...flowProps} />;
    }
}

const requests = [
    'CHECKOUT/SHIPPING_METHOD/',
    'CHECKOUT/SHIPPING_ADDRESS/',
    'CHECKOUT/ORDER/'
];

const loadingSelector = createLoadingSelector(requests);

const mapStateToProps = ({ cart, checkout, directory, user, loading }) => {
    const { addressConfig } = checkout;
    return {
        cart,
        checkout,
        directory,
        addressConfig,
        user,
        isFetching: loadingSelector(loading),
        isCartEmpty: isEmptyCartVisible({ cart, checkout })
    };
};

const mapDispatchToProps = {
    beginCheckout,
    cancelCheckout,
    editOrder,
    submitShippingAddress,
    submitOrder,
    submitPaymentMethodAndBillingAddress,
    submitShippingMethod,
    getShippingMethods,
    getCountries,
    getDirectoryConfig,
    getAddressConfig,
    submitNewAddress,
    acceptOrder
};

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(CheckoutWrapper);
