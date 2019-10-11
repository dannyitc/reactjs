import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form } from 'informed';
import { Price } from '@magento/peregrine';
import { getCartDetails, removeItemFromCart, updateItemInCart, updateCart } from 'src/actions/cart';
import { isEmptyCartVisible } from 'src/selectors/cart';
import CheckoutButton from 'src/components/Checkout/checkoutButton';
import EmptyCart from './emptyCart';
import CartItemList from './productList';
import classify from 'src/classify';
import defaultClasses from './cart.css';
import { createLoadingSelector } from '../../selectors/loading';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import CartActions from 'src/components/Cart/CartActions';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import Breadcrumbs from 'src/components/Breadcrumbs';

const CLEAR_CART = gql`
  mutation clearCart($cartId: String!) {
    clearCart(cartId: $cartId)
  }
`;
class Cart extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false
        };
    }

    async componentDidMount() {
        document.title = 'Shopping Cart';
        window.scrollTo(0, 0);
        await this.props.getCartDetails();
    }

    get cartId() {
        const { cart } = this.props;
        return cart && cart.details && cart.details.id;
    }

    get cartSummary() {
        const { cart, classes,base_currency_code } = this.props;
        const { cartId } = this;
        const hasSubtotal = cartId && cart.totals && 'subtotal' in cart.totals;

        return hasSubtotal ? (
            <div className={classes.totals}>
                <dl className={classes.totalRow}>
                    <dt className={classes.totalRowLabel}>{'Subtotal: '}</dt>
                    <dd className={classes.totalRowValue}>
                        <Price
                            currencyCode={base_currency_code}
                            value={cart.totals.subtotal}
                        />
                    </dd>
                </dl>
                {!cart.totals.shipping_amount ? null
                    : <dl className={classes.totalRow}>
                        <dt className={classes.totalRowLabel}>{'Shipping: '}</dt>
                        <dd className={classes.totalRowValue}>
                            <Price
                                currencyCode={base_currency_code}
                                value={cart.totals.shipping_amount}
                            />
                        </dd>
                    </dl>
                }
                {!cart.totals.discount_amount ? null
                    : <dl className={classes.totalRow}>
                        <dt className={classes.totalRowLabel}>{'Discount: '}</dt>
                        <dd className={classes.totalRowValue}>
                            <Price
                                currencyCode={base_currency_code}
                                value={cart.totals.discount_amount}
                            />
                        </dd>
                    </dl>
                }
                {!cart.totals.tax_amount ? null
                    : <dl className={classes.totalRow}>
                        <dt className={classes.totalRowLabel}>{'Tax: '}</dt>
                        <dd className={classes.totalRowValue}>
                            <Price
                                currencyCode={base_currency_code}
                                value={cart.totals.tax_amount}
                            />
                        </dd>
                    </dl>
                }
                <dl className={classes.totalRow}>
                    <dt className={classes.totalRowLabel}>{'Order Total: '}</dt>
                    <dd className={classes.totalRowValue}>
                        <Price
                            currencyCode={base_currency_code}
                            value={cart.totals.base_grand_total}
                        />
                    </dd>
                </dl>
            </div>

        ) : null;
    }

    get cartItemList() {
        const { cart, removeItemFromCart, updateItemInCart, base_currency_code } = this.props;

        const { cartId } = this;

        return cartId ? (
            <CartItemList
                removeItemFromCart={removeItemFromCart}
                updateItemFromCart={updateItemInCart}
                showEditPanel={this.showEditPanel}
                currencyCode={base_currency_code}
                items={cart.details.items}
                totalsItems={cart.totals.items}
            />
        ) : null;
    }

    render() {

        const { cartItemList, props, cartId } = this;
        const { classes, isCartEmpty, isFetching, cart, base_currency_code, enable_min_order_amount, min_order_amount } = props;

        const showLoading = isFetching || this.state.isLoading;

        if (isCartEmpty && !isFetching) {
            return <EmptyCart />;
        }

        const hasSubtotal = cartId && cart.totals && 'subtotal' in cart.totals;
        let disable = false;
        let hasWarning = false;
        if(enable_min_order_amount && hasSubtotal && min_order_amount > cart.totals.base_grand_total){
            disable = true;
            hasWarning = true;
        }

        return (
            <div className={classes.root}>
                {/* <Breadcrumbs /> */}
                {showLoading &&
                    <div className={classes.loading}>
                        {loadingIndicator}
                    </div>
                }
                <div className={classes.pageTitleWrapper}>
                    <h1 className={classes.pageTitle}>
                        <span>Shopping Cart</span>
                    </h1>
                </div>

                {hasWarning?
                    <div>
                        Minimum order amount is  
                        <Price
                            currencyCode={base_currency_code}
                            value={min_order_amount}
                        />
                    </div>:''
                }

                <div className={classes.cartContainer}>
                    <Form
                        className={classes.formCart}
                        onSubmit={this.update}
                    >
                        <div className={classes.cartItemHeading}>
                            <span className={classes.cartItemInfo}>Item</span>
                            <span className={classes.cartItemPrice}>Price</span>
                            <span className={classes.cartItemQty}>Qty</span>
                            <span className={classes.cartItemSubtotal}>Subtotal</span>
                        </div>
                        <div className={classes.cartContent}>
                            {cartItemList}
                            <CartActions
                                clearCart={this.clearCart}
                            />
                        </div>
                    </Form>
                    <div className={classes.cartSummary}>
                        <h3 className={classes.summaryHeading}>
                            {'Summary'}
                        </h3>
                        {this.cartSummary}
                        <div className={classes.goToCheckoutButton}>
                            <CheckoutButton
                                disable={disable}
                                ready={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    update = (values) => {
        this.props.updateCart(values);
    };

    clearCart = () => {
        const { cart, client, getCartDetails } = this.props;
        this.setState({ isLoading: true });
        client.mutate({
            mutation: CLEAR_CART,
            variables: { cartId: cart.cartId }
        }).then(result => {
            console.log(result);
            getCartDetails({ forceRefresh: true });
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            this.setState({ isLoading: false });
        });;
    }

}

const requests = [
    'CART/UPDATE_ITEM/',
    'CART/REMOVE_ITEM/',
    'CART/GET_CART_DATA/',
    'CART/UPDATE_CART/'
];

const loadingSelector = createLoadingSelector(requests);

const mapStateToProps = state => {
    const { cart, loading, catalog } = state;
    const { base_currency_code, min_order_amount, enable_min_order_amount } = catalog.storeConfig;

    return {
        cart,
        isCartEmpty: isEmptyCartVisible(state),
        isFetching: loadingSelector(loading),
        base_currency_code,
        min_order_amount,
        enable_min_order_amount
    };
};

const mapDispatchToProps = {
    getCartDetails,
    removeItemFromCart,
    updateItemInCart,
    updateCart
};
export default compose(
    withApollo,
    withRouter,
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Cart);
