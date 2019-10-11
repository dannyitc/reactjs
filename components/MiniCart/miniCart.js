import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bool, func, object, shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';
import classify from 'src/classify';
import {
    getCartDetails,
    updateItemInCart,
    removeItemFromCart,
    openOptionsDrawer,
    closeOptionsDrawer
} from 'src/actions/cart';
import { cancelCheckout } from 'src/actions/checkout';
import { goToCartPage } from 'src/actions/cart';
import Button from 'src/components/Button';
import CheckoutButton from 'src/components/Checkout/checkoutButton';
import EmptyMiniCart from './emptyMiniCart';
import ProductList from './productList';
import defaultClasses from './miniCart.css';
import { isEmptyCartVisible } from 'src/selectors/cart';
import { createLoadingSelector } from '../../selectors/loading';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import { Link } from 'src/drivers';

import CartOptions from './cartOptions';

class MiniCart extends Component {
    static propTypes = {
        history: object,
        cancelCheckout: func.isRequired,
        cart: shape({
            details: object,
            cartId: string,
            totals: object,
            isOptionsDrawerOpen: bool,
            isLoading: bool
        }),
        classes: shape({
            body: string,
            footer: string,
            footerMaskOpen: string,
            header: string,
            goToCheckoutButton: string,
            root_open: string,
            root: string,
            subtotalLabel: string,
            subtotalValue: string,
            summary: string,
            title: string,
            totals: string
        }),
        isCartEmpty: bool,
        updateItemInCart: func,
        openOptionsDrawer: func.isRequired,
        closeOptionsDrawer: func.isRequired,
        isMiniCartMaskOpen: bool
    };

    constructor(...args) {
        super(...args);
        this.state = {
            isEditPanelOpen: false,
            focusItem: null,
            allowCheckout: true
        };
    }

    async componentDidMount() {
        const { getCartDetails } = this.props;
        await getCartDetails();
    }

    get cartId() {
        const { cart } = this.props;

        return cart && cart.details && cart.details.id;
    }

    get cartCurrencyCode() {
        const { cart } = this.props;

        return (
            cart &&
            cart.details &&
            cart.details.currency &&
            cart.details.currency.quote_currency_code
        );
    }

    get productList() {
        const { cart, removeItemFromCart, updateItemInCart } = this.props;

        const { cartCurrencyCode, cartId } = this;

        return cartId ? (
            <ProductList
                removeItemFromCart={removeItemFromCart}
                updateItemFromCart={updateItemInCart}
                openOptionsDrawer={this.openOptionsDrawer}
                currencyCode={cartCurrencyCode}
                items={cart.details.items}
                totalsItems={cart.totals.items}
            />
        ) : null;
    }

    get totalsSummary() {
        const { cart, classes } = this.props;
        const { cartCurrencyCode, cartId } = this;
        const hasSubtotal = cartId && cart.totals && 'subtotal' in cart.totals;

        return hasSubtotal ? (
            <dl className={classes.totals}>
                <dd className={classes.subtotalValue}>
                    <span className={classes.subtotalLabel}>
                        Cart Subtotal:{' '}
                    </span>
                    <Price
                        currencyCode={cartCurrencyCode}
                        value={cart.totals.subtotal}
                    />
                </dd>
                <dt className={classes.subtotalLabel}>
                    <span><strong>{cart.details.items_qty}</strong>{` Items`}</span>
                </dt>
            </dl>
        ) : null;
    }

    goToCheckoutPage = () => {
        const { history } = this.props;
        history.push('/checkout.html');
    };

    goToCartPage = () => {
        const { history, goToCartPage } = this.props;
        goToCartPage(history);
    };

    get checkout() {
        const { props, cartId } = this;
        const { classes, cart, enable_min_order_amount, min_order_amount} = props;
        const hasSubtotal = cartId && cart.totals && 'subtotal' in cart.totals;
        let submit = this.goToCheckoutPage;
        if(enable_min_order_amount && hasSubtotal && min_order_amount > cart.totals.base_grand_total){
            submit = this.goToCartPage;
        }
        return (
            <div>
                <div className={classes.goToCheckoutButton}>
                    <CheckoutButton
                        submit={submit}
                        ready={true}
                    />
                </div>
            </div>
        );
    }

    get productOptions() {
        const { props, state, closeOptionsDrawer } = this;
        const { updateItemInCart, cart } = props;
        const { focusItem } = state;

        if (focusItem === null) return;
        const hasOptions = focusItem.options.length !== 0;

        return hasOptions ? (
            // `Name` is being used here because GraphQL does not allow
            // filtering products by id, and sku is unreliable without
            // a reference to the base product. Additionally, `url-key`
            // cannot be used because we don't have page context in cart.
            <Query
                query={getProductDetailByName}
                variables={{ name: focusItem.name, onServer: false }}
            >
                {({ loading, error, data }) => {
                    if (error) return null;
                    if (loading) return loadingIndicator;

                    const itemWithOptions = data.products.items[0];

                    return (
                        <CartOptions
                            cartItem={focusItem}
                            configItem={itemWithOptions}
                            closeOptionsDrawer={closeOptionsDrawer}
                            isLoading={cart.isLoading}
                            updateCart={updateItemInCart}
                        />
                    );
                }}
            </Query>
        ) : (
                <CartOptions
                    cartItem={focusItem}
                    configItem={{}}
                    closeOptionsDrawer={closeOptionsDrawer}
                    isLoading={cart.isLoading}
                    updateCart={updateItemInCart}
                />
            );
    }

    get productConfirm() {
        const { classes } = this.props;

        return (
            <div className={classes.save}>
                <Button onClick={this.hideEditPanel}>Cancel</Button>
                <Button priority="high">Update Cart</Button>
            </div>
        );
    }

    openOptionsDrawer = item => {
        this.setState({
            focusItem: item
        });
        this.props.openOptionsDrawer();
    };

    closeOptionsDrawer = () => {
        this.props.closeOptionsDrawer();
    };

    get miniCartInner() {
        const {
            totalsSummary,
            checkout,
            productList,
            productOptions,
            props,
            state
        } = this;
        const { classes, isCartEmpty } = props;

        const { cartId } = this;

        if (isCartEmpty || !cartId) {
            return <EmptyMiniCart />;
        }

        const { isEditPanelOpen } = state;
        const header = totalsSummary;
        const body = isEditPanelOpen ? productOptions : productList;

        return (
            <Fragment>
                <div className={classes.header}>
                    {header}
                    {checkout}
                </div>
                <div className={classes.body}>{body}</div>
                <div className={classes.footer}>
                    <Button onClick={this.goToCartPage}>{'View and edit cart'}</Button>
                </div>
            </Fragment>
        );
    }

    render() {
        const { miniCartInner, props } = this;
        const { classes, isFetching, isOpen } = props;
        const className = isOpen ? classes.root_open : classes.root;
        return (
            <Fragment>
                <div className={className}>
                    <div className={classes.miniCartContentWrapper}>
                        <div className={classes.miniCartContent}>
                            {isFetching ? <div className={classes.loading}>
                                {loadingIndicator}
                            </div> : null}
                            {miniCartInner}
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const requests = [
    'CART/UPDATE_ITEM/',
    'CART/REMOVE_ITEM/'
];

const loadingSelector = createLoadingSelector(requests);

const mapStateToProps = state => {
    const { cart, loading, catalog } = state;
    const { min_order_amount, enable_min_order_amount } = catalog.storeConfig;
    return {
        cart,
        isCartEmpty: isEmptyCartVisible(state),
        isFetching: loadingSelector(loading),
        min_order_amount,
        enable_min_order_amount
    };
};

const mapDispatchToProps = {
    getCartDetails,
    removeItemFromCart,
    updateItemInCart,
    openOptionsDrawer,
    closeOptionsDrawer,
    goToCartPage,
    cancelCheckout
};

export default compose(
    withRouter,
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(MiniCart);
