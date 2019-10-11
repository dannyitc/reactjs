import React, { Component, Fragment } from 'react';
import { shape, string } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './attributes.css';
import findIndex from 'lodash/findIndex';


class Attribute extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            actions: string,
            lead: string
        }),
    };

    render() {
        const { attribute, item } = this.props;
        let index = findIndex(item.attributes, function (product_attribute) { return product_attribute.code === attribute.code });

        if (index === -1) {
            return null;
        }

        return <span
            dangerouslySetInnerHTML={{
                __html: item.attributes[index].value
            }}
        />
    }
}

export default classify(defaultClasses)(Attribute);