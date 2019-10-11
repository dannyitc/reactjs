import React, { Component } from 'react';
import { bool, func, shape, string } from 'prop-types';
import classify from 'src/classify';
import Button from 'src/components/Button';
import defaultClasses from './submitButton.css';

const isDisabled = (busy, valid) => busy || !valid;

class SubmitButton extends Component {
    static propTypes = {
        submitOrder: func.isRequired,
        submitting: bool.isRequired,
        classes: shape({
            root: string
        }),
        valid: bool.isRequired
    };

    render() {
        const { submitOrder, classes } = this.props;

        return (
            <Button
                className={classes.root}
                onClick={submitOrder}
            >
                Place Order
            </Button>
        );
    }
}

export default classify(defaultClasses)(SubmitButton);
