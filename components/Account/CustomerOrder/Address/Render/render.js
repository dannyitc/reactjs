import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './render.css';

class OrderAddressRender extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            emptyTitle: string,
            continue: string
        })
    };

    render() {
        const { classes, address } = this.props;

        return (
            <div>
                <address>
                    <b>{address.firstname} {address.lastname}</b>
                    <br />
                    {address.street}<br />
                    <br />
                    {address.city},{address.region}<br />
                    {address.postcode}<br />
                    {address.country_id}<br />
                    T: {address.telephone}
                </address>
                
            </div>
        );
    }
}

export default classify(defaultClasses)(OrderAddressRender);