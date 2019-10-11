import React, { Component, Fragment } from 'react';
import { string, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './PaymentSummary.css';

class PaymentSummary extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            emptyTitle: string,
            continue: string
        })
    };

    render() {
        const { classes, hasPaymentMethod, paymentData } = this.props;

        if (!hasPaymentMethod) {
            return null
        }

        let primaryDisplay = '';
        let secondaryDisplay = '';
        if (paymentData) {
            primaryDisplay = paymentData.details.cardType;
            secondaryDisplay = paymentData.description;
        }
        return (
            <div className={classes.paymentMethods}>
                <h2 className={classes.sidebarTitle}>
                    <span>Payment Methods:</span>
                </h2>
                <strong className={classes.paymentDisplayPrimary}>
                    {primaryDisplay}
                </strong>
                <br />
                <span className={classes.paymentDisplaySecondary}>
                    {secondaryDisplay}
                </span>
            </div>
        );


    }
}

export default classify(defaultClasses)(PaymentSummary);