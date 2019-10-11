import React, { Component, Fragment } from 'react';
import { shape, string } from 'prop-types';

import classify from 'src/classify';

import defaultClasses from './paymentsForm.css';

class PaymentsForm extends Component {
    static propTypes = {
        classes: shape({
            heading: string,
        })
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <Fragment >
                <h2 className={classes.heading}>Payment Methods</h2>
                {this.paymentMethodsList()}
            </Fragment>
        );
    }

    /*
     *  Class Properties.
     */
    onSelectPayment = event => {
        this.props.onSelectPayment(event.target.value);
    };

    paymentMethodsList = () => {
        const { classes, paymentMethods } = this.props;

        let selectablePaymentMethods;

        if (paymentMethods && paymentMethods.length) {
            selectablePaymentMethods = paymentMethods.map(({ title, code, instruction }) => (
                <div key={code} className={classes.paymentMethod}>
                    <div className={classes.paymentMethodTitle}>
                        <input type="radio" name="payment[method]" onChange={this.onSelectPayment} className={classes.methodRadio} id={code} value={code} />
                        <label className={classes.methodRadioLabel} htmlFor={code}><span>{title}</span></label>
                    </div>
                    {instruction &&
                        <div className={classes.paymentMethodContent}>
                            {instruction}
                        </div>
                    }
                </div>
            ));
        } else {
            selectablePaymentMethods = [];
        }
        return (
            <div>
                <div className={classes.paymentGroup}>
                    {selectablePaymentMethods}
                </div>
            </div>
        );
    };
}

export default classify(defaultClasses)(PaymentsForm);
