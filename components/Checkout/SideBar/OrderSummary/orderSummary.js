import React, { Component, Fragment } from 'react';
import { string, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './orderSummary.css';
import { Price } from '@magento/peregrine';
import CartItems from '../../cartItems';
import Button from 'src/components/Button';

class OrderSummary extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            emptyTitle: string,
            continue: string
        })
    };

    constructor(props) {
        super(props);
        this.state = {
            showCartItemList: false
        };
    }

    showCartItems = () => {
        this.setState({ showCartItemList: !this.state.showCartItemList })
    };

    get cartCurrencyCode() {
        const { cart } = this.props;

        return (
            cart &&
            cart.details &&
            cart.details.currency &&
            cart.details.currency.quote_currency_code
        );
    }

    get cartItemsList() {
        const { cart } = this.props;

        const { cartCurrencyCode } = this;

        return (
            <CartItems
                currencyCode={cartCurrencyCode}
                items={cart.details.items}
                totalsItems={cart.totals.items}
            />
        );
    }

    render() {
        const { classes, cart, step } = this.props;

        const cartItemsListClass = this.state.showCartItemList ? classes.cartItemsListActive : classes.cartItemsList;

        if (!cart || cart.totals === {} || cart.details === {}) {
            return null;
        }

        return (
            <div className={classes.orderReview}>
                <h2 className={classes.orderReviewTitle}>
                    <span>Order Summary</span>
                </h2>
                {step > 1 &&
                    <Fragment>
                        <div className={classes.summaryRow}>
                            <span className={classes.summaryRowLabel}>
                                Cart Subtotal
                        </span>
                            <span className={classes.summaryRowValue}>
                                <Price
                                    currencyCode={cart.totals.quote_currency_code}
                                    value={cart.totals.subtotal}
                                />
                            </span>
                        </div>
                        {cart.totals.discount_amount
                            ? <div className={classes.summaryRow}>
                                <span className={classes.summaryRowLabel}>
                                    Discount
                            </span>
                                <span className={classes.summaryRowValue}>
                                    <Price
                                        currencyCode={cart.totals.quote_currency_code}
                                        value={cart.totals.discount_amount}
                                    />
                                </span>
                            </div>
                            : null
                        }
                        {cart.totals.shipping_amount
                            ? <div className={classes.summaryRow}>
                                <span className={classes.summaryRowLabel}>
                                    Shipping
                            </span>
                                <span className={classes.summaryRowValue}>
                                    <Price
                                        currencyCode={cart.totals.quote_currency_code}
                                        value={cart.totals.shipping_amount}
                                    />
                                </span>
                            </div>
                            : null
                        }
                        {cart.totals.tax_amount
                            ? <div className={classes.summaryRow}>
                                <span className={classes.summaryRowLabel}>
                                    Tax
                            </span>
                                <span className={classes.summaryRowValue}>
                                    <Price
                                        currencyCode={cart.totals.quote_currency_code}
                                        value={cart.totals.tax_amount}
                                    />
                                </span>
                            </div>
                            : null
                        }
                        <div className={classes.summaryRow}>
                            <span className={classes.summaryRowLabel}>
                                Order Total
                        </span>
                            <span className={classes.summaryRowValue}>
                                <Price
                                    currencyCode={cart.totals.quote_currency_code}
                                    value={cart.totals.base_grand_total}
                                />
                            </span>
                        </div>
                    </Fragment>
                }
                <div className={cartItemsListClass}>
                    <div className={classes.title}>
                        <Button onClick={this.showCartItems}><span>{cart.details.items_qty} Item(s) in Cart</span></Button>
                    </div>
                    <div className={classes.cartItemsListContent}>
                        {this.cartItemsList}
                    </div>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(OrderSummary);