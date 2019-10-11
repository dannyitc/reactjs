import React, { Component, Fragment } from 'react';
import { string, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './ShippingMethodSummary.css';

import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import EditIcon from 'react-feather/dist/icons/edit-2';

class ShippingMethodSummary extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            emptyTitle: string,
            continue: string
        })
    };

    render() {
        const { classes, hasShippingMethod, shippingTitle, editShippingMethod } = this.props;

        if (!hasShippingMethod) {
            return null
        }

        return (
            <div className={classes.shippingMethods}>
                <h2 className={classes.sidebarTitle}>
                    <span>Shipping Method:</span>
                    <Button onClick={editShippingMethod}><Icon src={EditIcon} size={14} /></Button>
                </h2>
                <strong>{shippingTitle}</strong>
            </div>
        );
    }
}

export default classify(defaultClasses)(ShippingMethodSummary);