import React, { Component } from 'react';
import { array, bool, func, object, oneOf, shape, string } from 'prop-types';

import classify from 'src/classify';
import Form from './form';
import Receipt from './Receipt';
import defaultClasses from './flow.css';

class Flow extends Component {
    static propTypes = {
        history: object,
        actions: shape({
            beginCheckout: func,
            cancelCheckout: func,
            editOrder: func,
            submitShippingAddress: func,
            submitOrder: func,
            submitPaymentMethodAndBillingAddress: func,
            submitShippingMethod: func
        }).isRequired,
        cart: shape({
            details: object,
            cartId: string,
            totals: object
        }),
        checkout: shape({
            availableShippingMethods: array,
            availablePaymentMethods: array,
            billingAddress: shape({
                city: string,
                country_id: string,
                email: string,
                firstname: string,
                lastname: string,
                postcode: string,
                region_id: string,
                region_code: string,
                region: string,
                street: array,
                telephone: string
            }),
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
            submitting: bool
        }).isRequired,
        directory: shape({
            countries: array,
            directory_config: object
        }),
        addressConfig: object,
        classes: shape({
            root: string
        }),
        hasPaymentMethod: bool,
        hasShippingAddress: bool,
        hasShippingMethod: bool,
        isCartReady: bool,
        isCheckoutReady: bool,
        paymentData: shape({
            description: string,
            details: shape({
                cardType: string
            }),
            nonce: string
        }),
        shippingMethod: string,
        shippingTitle: string
    };

    get child() {
        const {
            actions,
            cart,
            checkout,
            hasPaymentMethod,
            hasShippingAddress,
            hasShippingMethod,
            directory,
            user,
            isCartReady,
            isCheckoutReady,
            newAddress,
            isFetching,
            isCartEmpty,
            addressConfig
        } = this.props;

        const { isSignedIn } = user;

        const {
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
        } = actions;

        const {
            availableShippingMethods,
            availablePaymentMethods,
            billingAddress,
            editing,
            isAddressIncorrect,
            incorrectAddressMessage,
            paymentData,
            shippingAddress,
            shippingMethod,
            shippingTitle,
            step,
            submitting,
            checkoutStep
        } = checkout;

        switch (step) {
            case 'form': {
                const stepProps = {
                    beginCheckout,
                    availableShippingMethods,
                    availablePaymentMethods,
                    billingAddress,
                    cancelCheckout,
                    cart,
                    directory,
                    user,
                    editOrder,
                    editing,
                    hasPaymentMethod,
                    hasShippingAddress,
                    hasShippingMethod,
                    incorrectAddressMessage,
                    isAddressIncorrect,
                    paymentData,
                    isCartReady: isCartReady,
                    ready: isCheckoutReady,
                    shippingAddress,
                    shippingMethod,
                    shippingTitle,
                    submitShippingAddress,
                    submitOrder,
                    submitPaymentMethodAndBillingAddress,
                    submitShippingMethod,
                    submitting,
                    newAddress,
                    submitNewAddress,
                    getShippingMethods,
                    checkoutStep,
                    isFetching,
                    isCartEmpty,
                    acceptOrder,
                    addressConfig
                };

                return <Form {...stepProps} />;
            }
            case 'receipt': {
                return <Receipt isSignedIn={isSignedIn} />;
            }
            default: {
                return null;
            }
        }
    }

    render() {
        const { child, props } = this;
        const { classes } = props;

        return <div className={classes.root}>{child}</div>;
    }
}

export default classify(defaultClasses)(Flow);
