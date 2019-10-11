import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './progressBar.css';

class ProgressBar extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            emptyTitle: string,
            continue: string
        })
    };

    constructor(props) {
        super(props);
        this.state = {
            step: 1
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { currentStep } = props;
        if (!currentStep) {
            return state;
        }
        return {
            ...state,
            step: currentStep
        }
    }


    render() {
        const {
            classes,
            editAddress,
            editShippingMethod,
            editPaymentMethod
        } = this.props;

        const { step } = this.state;

        return (
            <div className={classes.progressBar}>
                <ul className={classes.opcProgressBar}>
                    <li className={classes.progressBarItem}>
                        <button
                            className={classes.barItemClick}
                            onClick={editAddress}
                        >
                            <span>Shipping Address</span>
                        </button>
                    </li>
                    <li className={classes.progressBarItem}>
                        <button
                            className={classes.barItemClick}
                            disabled={step < 2}
                            onClick={editShippingMethod}
                        >
                            <span>Shipping Methods</span>
                        </button>
                    </li>
                    <li className={classes.progressBarItem}>
                        <button
                            className={classes.barItemClick}
                            disabled={step < 3}
                            onClick={editPaymentMethod}
                        >
                            <span>Payment Methods</span>
                        </button>
                    </li>
                </ul>
            </div>
        );
    }
}

export default classify(defaultClasses)(ProgressBar);