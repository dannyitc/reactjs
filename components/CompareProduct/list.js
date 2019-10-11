import React, { Component } from 'react';
import { string, shape, number } from 'prop-types';

import classify from 'src/classify';
import Items, { emptyData } from './items';
import defaultClasses from './list.css';

class List extends Component {
    static propTypes = {
        classes: shape({
            filters: string,
            items: string,
            pagination: string,
            root: string,
            oneItem: string,
            twoItems: string,
            threeItems: string,
            fourItems: string
        }),
        pageSize: number
    };

    static defaultProps = {
        data: emptyData
    };

    render() {
        const { layout, classes, data, pageSize, addToCart, removeItem } = this.props;
        const hasData = Array.isArray(data) && data.length;
        const items = hasData ? data : emptyData;

        const classLayout = layout ? classes[layout] : classes.root;

        return (
            <div className={classLayout}>
                <Items
                    layout={layout}
                    items={items}
                    pageSize={pageSize}
                    addToCart={addToCart}
                    removeItem={removeItem}
                />
            </div>
        );
    }
}

export default classify(defaultClasses)(List);
