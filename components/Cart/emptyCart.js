import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import { Link, resourceUrl } from 'src/drivers';
import classify from 'src/classify';
import defaultClasses from './emptyCart.css';

class EmptyCart extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            emptyTitle: string,
            continue: string
        })
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <h3 className={classes.emptyTitle}>
                    Shopping Cart
                </h3>
                <div className={classes.emptyCart}>
                    <p>You have no items in your shopping cart.</p>
                    <p>Click
                        <Link to={resourceUrl('/')}>
                            here
                        </Link>
                        to continue shopping.</p>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(EmptyCart);
