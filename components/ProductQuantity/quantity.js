import React, { Component } from 'react';
import { arrayOf, number, shape, string } from 'prop-types';

import classify from 'src/classify';
import QuantityInput from './quantityInput';
import defaultClasses from './quantity.css';

class Quantity extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        items: arrayOf(
            shape({
                value: number
            })
        )
    };

    static defaultProps = {
        inputLabel: "product's quantity",
        defaultQty: 1
    };

    inputFocus = () => {};

    handleQtyChange = values => {};

    render() {
        const { classes, inputLabel, defaultQty, ...restProps } = this.props;

        return (
            <div className={classes.root}>
                <QuantityInput
                    field="quantity.input"
                    onFocus={this.inputFocus}
                    onChange={this.handleQtyChange}
                    aria-label={inputLabel}
                />
            </div>
        );
    }
}

export default classify(defaultClasses)(Quantity);
