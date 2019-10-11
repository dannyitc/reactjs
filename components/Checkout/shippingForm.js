import React, { Component } from 'react';
import { Form } from 'informed';
import { array, bool, func, shape, string } from 'prop-types';
import Button from 'src/components/Button';
import Label from './label';
import classify from 'src/classify';
import defaultClasses from './shippingForm.css';
import { Price } from '@magento/peregrine';

class ShippingForm extends Component {
    static propTypes = {
        availableShippingMethods: array.isRequired,
        cancel: func.isRequired,
        classes: shape({
            body: string,
            button: string,
            footer: string,
            heading: string,
            shippingMethod: string
        }),
        shippingMethod: string,
        submit: func.isRequired,
        submitting: bool
    };

    constructor(props) {
        super(props);
        this.state = {
            inputShippingMethod: undefined
        };
    }

    static defaultProps = {
        availableShippingMethods: [{}]
    };

    handleSelectMethodOnChange = event => {
        this.setState({ inputShippingMethod: event.target.value });
    };

    selectShippingMethod = (methodSelected) => {
        this.setState({ inputShippingMethod: methodSelected });
    };

    get cartCurrencyCode() {
        const { cart } = this.props;

        return (
            cart &&
            cart.details &&
            cart.details.currency &&
            cart.details.currency.quote_currency_code
        );
    }

    render() {
        const {
            availableShippingMethods,
            classes,
            submitting,
            cart
        } = this.props;

        if (!cart || cart.totals === {} || cart.details === {}) return null;

        let selectableShippingMethods;

        if (availableShippingMethods.length) {
            selectableShippingMethods = availableShippingMethods.map(
                ({ carrier_code, carrier_title, method_title, amount }) => (
                    <div key={carrier_code} className={classes.shippingMethod}>
                        <div className={classes.shippingMethodTitle}>
                            <input type="radio" name="shippingMethod" onChange={this.handleSelectMethodOnChange} className={classes.methodRadio} id={carrier_code} value={carrier_code} />
                            <Label className={classes.methodDetails} htmlFor={carrier_code}>
                                <span className={classes.methodPrice}>
                                    <Price
                                        currencyCode={this.cartCurrencyCode}
                                        value={amount}
                                    />
                                </span>
                                <span className={classes.methodTitle}>{method_title}</span>
                                <span className={classes.carrierTitle}>{carrier_title}</span>
                            </Label>
                        </div>
                    </div>
                ));
        } else {
            selectableShippingMethods = [];
        }

        return (
            <Form className={classes.root} onSubmit={this.submit}>
                <div className={classes.body}>
                    <h2 className={classes.heading}>Shipping Methods</h2>
                    <div className={classes.shippingMethodGroup}>
                        {selectableShippingMethods}
                    </div>
                </div>
                {this.state.inputShippingMethod &&
                    <div className={classes.footer}>
                        <Button
                            className={classes.button}
                            priority="high"
                            type="submit"
                            disabled={submitting}
                        >
                            Next
                        </Button>
                    </div>
                }
            </Form>
        );
    }

    cancel = () => {
        this.props.cancel();
    };

    submit = () => {
        const selectedShippingMethod = this.props.availableShippingMethods.find(
            ({ carrier_code }) => carrier_code === this.state.inputShippingMethod
        );

        if (!selectedShippingMethod) {
            console.warn(
                `Could not find the selected shipping method ${selectedShippingMethod} in the list of available shipping methods.`
            );
            this.cancel();
            return;
        }

        this.props.submit({ shippingMethod: selectedShippingMethod });
    };
}

export default classify(defaultClasses)(ShippingForm);
