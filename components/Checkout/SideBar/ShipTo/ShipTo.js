import React, { Component, Fragment } from 'react';
import { string, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './ShipTo.css';

import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import EditIcon from 'react-feather/dist/icons/edit-2';

class ShipTo extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            emptyTitle: string,
            continue: string
        })
    };

    render() {
        const { classes, hasShippingAddress, shippingAddress, editAddress } = this.props;

        if (!hasShippingAddress) {
            return null
        }

        const address = shippingAddress;

        const name = `${address.firstname} ${address.lastname}`;
        const street = `${address.street.join(' ')}`;
        const region = typeof (address.region) === 'object' ? address.region.region : address.region;
        
        return (
            <div className={classes.shipTo}>
                <h2 className={classes.sidebarTitle}>
                    <span>Ship To:</span>
                    <Button onClick={editAddress}><Icon src={EditIcon} size={14} /></Button>
                </h2>
                <address>
                    <strong>{name}</strong>
                    <br />
                    <span>{street}</span><br />
                    {address.city},{region},{address.country_id}<br />
                    {address.postcode}<br />
                    {address.telephone}
                </address>
            </div>
        );


    }
}

export default classify(defaultClasses)(ShipTo);