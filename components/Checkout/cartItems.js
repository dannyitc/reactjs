import React, { Component } from 'react';
import { arrayOf, number, shape, string } from 'prop-types';
import { List } from '@magento/peregrine';

import classify from 'src/classify';
import Product from './product';
import defaultClasses from './cartItems.css';

class CartItems extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        items: arrayOf(
            shape({
                item_id: number.isRequired,
                name: string.isRequired,
                price: number.isRequired,
                product_type: string,
                qty: number.isRequired,
                quote_id: string,
                sku: string.isRequired
            })
        ),
        currencyCode: string
    };

    static defaultProps = {
        classes: {},
        currencyCode: 'USD'
    };

    render() {
        const {
            currencyCode,
            removeItemFromCart,
            showEditPanel,
            totalsItems,
            ...otherProps
        } = this.props;

        return (
            <List
                render="ul"
                getItemKey={item => item.item_id}
                renderItem={props => (
                    <Product
                        currencyCode={currencyCode}
                        removeItemFromCart={removeItemFromCart}
                        showEditPanel={showEditPanel}
                        totalsItems={totalsItems}
                        {...props}
                    />
                )}
                {...otherProps}
            />
        );
    }
}

export default classify(defaultClasses)(CartItems);
