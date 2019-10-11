import React, { Component, Suspense } from 'react';
import { object, shape, string } from 'prop-types';
import defaultClasses from './checkout.css';
import { Price } from '@magento/peregrine';
import classify from 'src/classify';
import Breadcrumbs from 'src/components/Breadcrumbs';
import Skeleton from 'react-loading-skeleton';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
const Checkout = React.lazy(() => import('src/components/Checkout'));

class CheckoutPage extends Component {
    static propTypes = {
        cart: shape({ details: object, cartId: string, totals: object }),
        classes: shape({
            body: string,
            footer: string,
            header: string,
            continueShoppingButton: string,
            root_open: string,
            root: string,
            subtotalLabel: string,
            subtotalValue: string,
            summary: string,
            title: string,
            totals: string
        })
    };

    componentDidMount() {
        document.title = 'Checkout';
        window.scrollTo(0, 0);
    }

    goToCartPage = () => {
        const { history } = this.props;
        history.push('/cart.html');
    };


    get totalsSummary() {
        const { cart, classes } = this.props;
        const { cartCurrencyCode, cartId } = this;
        const hasSubtotal = cartId && cart.totals && 'subtotal' in cart.totals;

        return hasSubtotal ? (
            <dl className={classes.totals}>
                <dt className={classes.subtotalLabel}>
                    <span>Subtotal {` (${cart.details.items_qty} Items)`}</span>
                </dt>
                <dd className={classes.subtotalValue}>
                    <Price
                        currencyCode={cartCurrencyCode}
                        value={cart.totals.subtotal}
                    />
                </dd>
            </dl>
        ) : null;
    }

    get checkout() {
        const { props, totalsSummary, checkoutSkeleton } = this;
        const { classes, cart, checkout, enable_min_order_amount, min_order_amount } = props;
        const hasSubtotal = cart && cart.totals && 'subtotal' in cart.totals;
        if(enable_min_order_amount && hasSubtotal && min_order_amount > cart.totals.base_grand_total){
            this.goToCartPage();
        }
        return (
            <div className={classes.checkoutContent}>
                <div className={classes.summary}>{totalsSummary}</div>
                <Suspense fallback={checkoutSkeleton}>
                    <Checkout cart={cart} checkout={checkout} />
                </Suspense>
            </div>
        );
    }

    get checkoutSkeleton() {
        const { classes } = this.props;

        return (
            <div className={classes.checkoutSkeletonWrapper}>
                <div className={classes.progressBar}><Skeleton width='100%' height='50px' /></div>
                <div className={classes.checkoutSkeletonContent}>
                    <div className={classes.checkoutSkeletonFormContent}><Skeleton height='500px' /></div>
                    <div className={classes.sidebar}><Skeleton height='200px' /></div>
                </div>
            </div>
        );
    }

    render() {
        if (this.props.loading) {
            return this.checkoutSkeleton;
        }
        const { checkout, props } = this;
        const { classes } = props;
        return (
            <div className={classes.checkoutWrapper}>
                <Breadcrumbs />
                {checkout}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { cart, catalog } = state;
    const { min_order_amount, enable_min_order_amount } = catalog.storeConfig;
    return {
        cart,
        min_order_amount,
        enable_min_order_amount
    };
};

export default compose(
    withRouter,
    classify(defaultClasses),
    connect(
        mapStateToProps,
        null
    )
)(CheckoutPage);