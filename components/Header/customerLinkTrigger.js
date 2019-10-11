import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './customerLinkTrigger.css';

class CustomerLinkTrigger extends Component {
    static propTypes = {
        children: PropTypes.node,
        classes: PropTypes.shape({
            root: PropTypes.string,
            open: PropTypes.string
        }),
        customerLinksOpen: PropTypes.bool,
        toggleCustomerMenu: PropTypes.func.isRequired
    };

    render() {
        const {
            children,
            classes,
            toggleCustomerMenu,
            customerLinksOpen
        } = this.props;
        const customerLinksClass = customerLinksOpen
            ? classes.open
            : classes.root;

        return (
            <Fragment>
                <button
                    className={customerLinksClass}
                    onClick={toggleCustomerMenu}
                >
                    {children}
                </button>
            </Fragment>
        );
    }
}

export default classify(defaultClasses)(CustomerLinkTrigger);
