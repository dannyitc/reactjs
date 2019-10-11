import React, { Component } from 'react';
import { arrayOf, string, number, shape } from 'prop-types';
import Item from './item';

const pageSize = 12;
const emptyData = Array.from({ length: pageSize }).fill(null);

// inline the placeholder elements, since they're constant
const defaultPlaceholders = emptyData.map((_, index) => (
    <Item key={index} placeholder={true} />
));

class Items extends Component {
    static propTypes = {

    };

    render() {
        const { layout, items, addToCart,removeItem } = this.props;

        return items.map(item =>
            <Item
                key={item.id}
                item={item}
                layout={layout}
                addToCart={addToCart}
                removeItem={removeItem}
            />
        );
    }
}

export { Items as default, emptyData };
