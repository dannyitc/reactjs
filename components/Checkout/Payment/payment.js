import React, { Component } from 'react';
import gql from 'graphql-tag';
import { array, func, shape, string } from 'prop-types';
import { withApollo } from 'react-apollo';
import { compose } from 'redux';
import { toast } from "react-toastify";

import Button from 'src/components/Button';
import classify from 'src/classify';

import defaultClasses from './payment.css';
import Billing from '../Billing';
import PaymentsForm from './paymentsForm';

const query = gql`
    query order ($id: Int!) {
        order (id: $id) {
           increment_id
        }
    }
`;

class Payment extends Component {
    static propTypes = {
        cancel: func.isRequired,
        classes: shape({
            address_check: string,
            body: string,
            button: string,
            braintree: string,
            city: string,
            footer: string,
            heading: string,
            postcode: string,
            region_code: string,
            street0: string,
            textInput: string
        }),
        countries: array
    };

    constructor(props) {
        super(props);
        this.state = {
            paymentMethod: null,
            billingData: null,
            hasUpdate: false,
            sameShipping: false
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { shippingAddress } = props;
        const { hasUpdate, billingData } = state;

        return {
            ...state,
            billingData: hasUpdate ? billingData : shippingAddress
        };
    }

    render() {
        const { classes, countries, paymentMethods, shippingAddress, user } = this.props;
        const { isSignedIn, currentUser } = user;
        const { addresses } = currentUser;

        return (
            <div className={classes.root}>
                <div className={classes.body}>
                    <PaymentsForm
                        paymentMethods={paymentMethods}
                        onSelectPayment={this.onSelectPayment}
                    />
                    <Billing
                        countries={countries}
                        shippingAddress={shippingAddress}
                        user={user}
                        addresses={addresses}
                        isSignedIn={isSignedIn}
                        onChangeSameShipping={this.onChangeSameShipping}
                        changeBillingData={this.changeBillingData}
                    />
                </div>
                {this.state.paymentMethod && this.state.billingData &&
                    <div className={classes.footer}>
                        <Button
                            className={classes.button}
                            priority="high"
                            onClick={this.placeOrder}
                        >
                            Place Order
                        </Button>
                    </div>
                }
            </div>
        );
    }

    /*
     *  Event Handlers.
     */
    cancel = () => {
        this.props.cancel();
    };

    onSelectPayment = (method) => {
        this.setState({ paymentMethod: method })
    }

    onChangeSameShipping = (payload) => {
        this.setState({
            hasUpdate: true,
            billingData: payload.billingData,
            sameShipping: payload.same
        })
    }

    changeBillingData = (data) => {
        this.setState({
            hasUpdate: true,
            billingData: data
        })
    }

    placeOrder = () => {
        const { billingData, sameShipping, } = this.state;
        const { client, acceptOrder, submitOrder } = this.props;
        if (!billingData) {
            return;
        }

        let billingAddress;
        if (!sameShipping) {
            billingAddress = billingData;
            if (typeof billingAddress.street === 'string') billingAddress.street = [billingAddress.street];
            delete billingAddress.same_shipping;
            delete billingAddress.address_id;
        } else {
            billingAddress = {
                sameShipping
            };
        }

        // Submit the payment method and billing address payload.
        submitOrder({
            billingAddress,
            paymentMethod: {
                code: this.state.paymentMethod
            }
        }).then(orderId => {
            client.query({
                query: query,
                variables: { id: orderId }
            }).then(result => {
                acceptOrder(result.data.order.increment_id);
            }).catch((error) => {
                toast.error("Something's wrong.Please try again");
                console.log(error);
            });
        });
    };

}

export default compose(
    withApollo,
    classify(defaultClasses)
)(Payment);