import React, { Component } from 'react';
import { string, shape, object } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './actions.css';
import { compose } from 'redux';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import Icon from 'src/components/Icon';
import Button from 'src/components/Button';
import reFreshIcon from 'react-feather/dist/icons/refresh-cw';
import chevronLeftIcon from 'react-feather/dist/icons/chevron-left';
import { confirmAlert } from 'react-confirm-alert';
import 'src/styles/react-confirm-alert.scss';

const iconDimensions = { height: 20, width: 20 };

class CartActions extends Component {
    static propTypes = {
        history: object,
        classes: shape({
            root: string,
            emptyTitle: string,
            continue: string
        })
    };

    constructor() {
        super();
        this.state = {
            isLoading: false,
        };
    }

    render() {
        const { classes } = this.props;

        const { continueShoppingButton, clearCartButton, updateCartButton } = defaultClasses;

        return (
            <div className={classes.cartActions}>
                <Button
                    className={continueShoppingButton}
                    onClick={this.continueShopping}
                    name="continue-shopping"
                >
                    <Icon src={chevronLeftIcon} attrs={iconDimensions} />{'Continue Shopping'}
                </Button>
                <Button
                    className={updateCartButton}
                    name="update-shopping-cart"
                    priority="high"
                    type="submit"
                >
                    <Icon src={reFreshIcon} attrs={iconDimensions} />{'Update Shopping Cart'}
                </Button>
                <Button
                    className={clearCartButton}
                    onClick={this.clearCart}
                    name="clear-shopping-cart"
                >
                    {'Clear Shopping Cart'}
                </Button>
            </div>
        );
    }

    updateCart = () => {
        const { formState, updateCart } = this.props;
        updateCart(formState);
    };

    continueShopping = () => {
        const { history } = this.props;
        history.push('');
    };

    clearCart = () => {
        const { clearCart } = this.props;
        confirmAlert({
            title: 'Clear Shopping Cart',
            message: 'Are you sure ?',
            buttons: [
                {
                    label: 'OK',
                    onClick: () => clearCart()
                },
                {
                    label: 'Cancel',
                    onClick: () => console.log('Cancel')
                }
            ]
        });
    };
}

export default compose(
    withApollo,
    withRouter,
    classify(defaultClasses)
)(CartActions);
