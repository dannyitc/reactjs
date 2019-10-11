import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './addressRender.css';

class AddressRender extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            emptyTitle: string,
            continue: string
        })
    };

    render() {
        const { address } = this.props;
        if (!address) return null;
        const region = typeof (address.region) === 'object' ? address.region.region : address.region;
        return (
            <div>
                <address>
                    <b>{address.firstname} {address.lastname}</b>
                    <br />
                    {address.street ? address.street[0] : null}<br />
                    {address.city},{region} {address.postcode}<br />
                    {address.country_id}<br />
                    {address.telephone}
                </address>

            </div>
        );
    }
}

export default classify(defaultClasses)(AddressRender);