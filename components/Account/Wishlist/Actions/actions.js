import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './actions.css';
import Button from 'src/components/Button';

class WishlistAction extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            emptyTitle: string,
            continue: string
        })
    };

    update = () => {
        this.props.update();
    };

    addAllToCart = () => {
        this.props.addAllToCart();
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.actions}>
                <Button type="button" priority="high" onClick={this.addAllToCart}>
                    {'Add All to Cart'}
                </Button>
                <Button type="button" priority="high" onClick={this.update}>
                    {'Update Wish List'}
                </Button>
            </div>
        );
    }
}

export default classify(defaultClasses)(WishlistAction);

