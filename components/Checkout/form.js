import React, { Component } from 'react';
import { array, bool, func, object, oneOf, shape, string } from 'prop-types';

import AddressForm from './addressForm';
import AddressList from './AddressList';
import ProgressBar from './ProgressBar';
import SideBar from './SideBar';
import Payment from './Payment';
import ShippingForm from './shippingForm';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import EmptyCart from 'src/components/Cart/emptyCart';

import classify from 'src/classify';
import defaultClasses from './form.css';

const steps = {
    address: 1,
    shippingMethod: 2,
    paymentMethod: 3
}
class Form extends Component {
    static propTypes = {
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
        cancelCheckout: func.isRequired,
        cart: shape({
            details: object,
            cartId: string,
            totals: object
        }).isRequired,
        directory: shape({
            countries: array
        }).isRequired,
        classes: shape({
            body: string,
            footer: string,
            informationPrompt: string,
            'informationPrompt--disabled': string,
            paymentDisplayPrimary: string,
            paymentDisplaySecondary: string,
            root: string
        }),
        editing: oneOf(['address', 'shippingMethod', 'paymentMethod']),
        editOrder: func.isRequired,
        hasPaymentMethod: bool,
        hasShippingAddress: bool,
        hasShippingMethod: bool,
        incorrectAddressMessage: string,
        isAddressIncorrect: bool,
        paymentData: shape({
            description: string,
            details: shape({
                cardType: string
            }),
            nonce: string
        }),
        isCartReady: bool,
        ready: bool,
        shippingMethod: string,
        shippingTitle: string,
        submitShippingAddress: func.isRequired,
        submitOrder: func.isRequired,
        submitPaymentMethodAndBillingAddress: func.isRequired,
        submitShippingMethod: func.isRequired,
        submitting: bool.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            step: 1
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { checkoutStep } = props;
        if (!checkoutStep) {
            return state;
        }
        return {
            ...state,
            step: checkoutStep
        }
    }

    get forms() {
        const {
            submitting,
            isAddressIncorrect,
            incorrectAddressMessage,
            directory,
            getShippingMethods,
            user,
            cart,
            newAddress,
            submitNewAddress,
            submitOrder,
            shippingAddress,
            addressConfig,
            acceptOrder
        } = this.props;
        const { step } = this.state;
        const { countries, directory_config } = { ...directory };
        const { isSignedIn, currentUser } = user || {};
        const addresses = isSignedIn ? currentUser.addresses : null;

        switch (step) {
            case 1: {
                return (
                    isSignedIn && addresses.length
                        ? <AddressList
                            user={user}
                            newAddress={newAddress}
                            addresses={addresses}
                            submitShippingAddress={this.submitShippingAddress}
                            directory={directory}
                            addressConfig={addressConfig}
                            submitNewAddress={submitNewAddress}
                            getShippingMethods={getShippingMethods}
                            shippingAddress={shippingAddress}
                            isSignedIn={isSignedIn}
                        />
                        : <AddressForm
                            initialValues={shippingAddress}
                            submitting={submitting}
                            countries={countries}
                            directory_config = {directory_config}
                            addressConfig={addressConfig}
                            cancel={this.stopEditing}
                            submit={this.submitShippingAddress}
                            isAddressIncorrect={isAddressIncorrect}
                            incorrectAddressMessage={incorrectAddressMessage}
                            getShippingMethods={getShippingMethods}
                            inline={true}
                            isSignedIn={isSignedIn}
                        />
                );
            }
            case 2: {
                const { availableShippingMethods, shippingMethod } = this.props;

                return (
                    <ShippingForm
                        availableShippingMethods={availableShippingMethods}
                        cancel={this.stopEditing}
                        shippingMethod={shippingMethod}
                        submit={this.submitShippingMethod}
                        submitting={submitting}
                        cart={cart}
                    />
                );
            }
            case 3: {
                const { billingAddress, cart } = this.props;
                return (
                    <Payment
                        paymentMethods={cart.paymentMethods}
                        cancel={this.stopEditing}
                        initialValues={billingAddress}
                        countries={countries}
                        submitOrder={submitOrder}
                        shippingAddress={shippingAddress}
                        user={user}
                        countries={countries}
                        directory_config = {directory_config}
                        addressConfig={addressConfig}
                        acceptOrder={acceptOrder}
                    />
                );
            }
            default: {
                return null;
            }
        }
    }

    render() {
        const {
            classes,
            cart,
            hasShippingAddress,
            shippingAddress,
            hasPaymentMethod,
            paymentData,
            shippingTitle,
            hasShippingMethod,
            isFetching,
            isCartReady,
            isCartEmpty
        } = this.props;

        if (typeof isCartEmpty === 'undefined') {
            return null;
        }

        return (
            isCartReady && !isCartEmpty
                ? <div className={classes.root}>
                    {isFetching && <div className={classes.loading}>{loadingIndicator}</div>}
                    <ProgressBar
                        editAddress={this.editAddress}
                        editShippingMethod={this.editShippingMethod}
                        editPaymentMethod={this.editPaymentMethod}
                        currentStep={this.state.step}
                    />
                    <div className={classes.checkoutInner}>
                        <div className={classes.checkoutStepContent}>
                            {this.forms}
                        </div>
                        <SideBar
                            cart={cart}
                            step={this.state.step}
                            hasShippingAddress={hasShippingAddress}
                            shippingAddress={shippingAddress}
                            hasPaymentMethod={hasPaymentMethod}
                            paymentData={paymentData}
                            shippingTitle={shippingTitle}
                            hasShippingMethod={hasShippingMethod}
                            editAddress={this.editAddress}
                            editShippingMethod={this.editShippingMethod}
                        />
                    </div>
                </div>
                : <EmptyCart />
        );
    }

    /*
     *  Event Handlers.
     */
    dismissCheckout = () => {
        this.props.cancelCheckout();
    };

    changeStep = (step) => {
        this.setState({ step: step });
    }

    editStep = (type) => {
        const step = steps[type];
        this.changeStep(step);
        this.props.editOrder(step);
    }

    editAddress = () => {
        this.editStep('address');
    };

    editShippingMethod = () => {
        this.editStep('shippingMethod');
    };

    editPaymentMethod = () => {
        this.editStep('paymentMethod');
    };

    stopEditing = () => {
        this.props.editOrder(null);
    };

    changeShippingAddress = (formValues) => {
        this.props.submitShippingAddress({
            type: 'shippingAddress',
            formValues
        });
    }

    submitShippingAddress = formValues => {
        const { user } = this.props;
        const { isSignedIn, currentUser } = user;
        if (isSignedIn) {
            formValues.email = currentUser.email;
        }
        this.changeShippingAddress(formValues);
    };

    submitShippingMethod = formValues => {
        this.props.submitShippingMethod({
            type: 'shippingMethod',
            formValues
        });
    };

    submitOrder = formValues => {
        this.props.submitOrder({ formValues });
    };
}

export default classify(defaultClasses)(Form);
