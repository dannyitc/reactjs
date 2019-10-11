import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './render.css';

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

        return (
            <div>
                <address>
                    <b>{address.firstname} {address.lastname}</b>
                    <br />
                    {address.street ? address.street[0] : null}<br />
                    {address.city},{address.region ? address.region.region : ''},{address.country_id}<br />
                    {address.postcode}<br />
                    T: {address.telephone}
                </address>
                
            </div>
        );
    }
}

export default classify(defaultClasses)(AddressRender);