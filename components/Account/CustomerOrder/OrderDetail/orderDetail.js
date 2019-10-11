import React, { Component } from 'react';
import { string, shape, arrayOf, number } from 'prop-types';
import { connect } from 'src/drivers';
import { compose } from 'redux';
import classify from 'src/classify';
import defaultClasses from './orderDetail.css';
import { Price } from '@magento/peregrine';
import OrderItem from '../OrderItem';
import OrderAddressRender from '../Address/Render';

class OrderDetail extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        productItems: arrayOf(
            shape({
                id: number.isRequired,
                name: string.isRequired,
                small_image: string.isRequired,
                price: shape({
                    regularPrice: shape({
                        amount: shape({
                            value: number.isRequired,
                            currency: string.isRequired
                        }).isRequired
                    }).isRequired
                }).isRequired,
                quantity: number.isRequired,
                subtotal: shape({
                    amount: shape({
                        value: number.isRequired,
                        currency: string.isRequired
                    }).isRequired
                }).isRequired
            })
        )
    };

    get orderItems() {
        const { order } = this.props;
        const { items } = order;
        return Array.isArray(items) ? items.map(item => <OrderItem key={item.id} item={item} />) : null;
    }

    render() {
        const { classes, order, cart } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.orderDetails}>
                    <h2>Order Information</h2>
                    <div className={classes.orderInfo}>
                        <div className={classes.box}>
                            <strong className={classes.heading}>Shipping Address</strong>
                            {
                                order.shipping_address ?
                                    <OrderAddressRender address={order.shipping_address} />
                                    : null
                            }
                        </div>
                        <div className={classes.box}>
                            <strong className={classes.heading}>Shipping Method</strong>
                            <p>{order.shipping_description}</p>
                        </div>
                        <div className={classes.box}>
                            <strong className={classes.heading}>Billing Address</strong>
                            {
                                order.billing_address ?
                                    <OrderAddressRender address={order.billing_address} />
                                    : null
                            }
                        </div>
                        <div className={classes.box}>
                            <strong className={classes.heading}>Payment Method</strong>
                            <p>{order.payment_method}</p>
                        </div>
                    </div>
                    <strong>Order Items</strong>
                    <div className={classes.orderItems}>
                        <div className={classes.orderItemsheading}>
                            <div className={classes.productInfo}>Item</div>
                            <div className={classes.productInfo}>SKU</div>
                            <div className={classes.productUnitPrice}>Price</div>
                            <div className={classes.productQty}>Qty</div>
                            <div className={classes.subtotal}>Subtotal</div>
                        </div>
                        <div className={classes.listItems}>
                            {this.orderItems}
                        </div>
                    </div>
                    <div className={classes.orderTotals}>
                        <div className={classes.totalRow}>
                            <strong>Subtotal</strong>
                            <span>
                                <Price
                                    currencyCode={cart.totals.base_currency_code}
                                    value={order.subtotal}
                                />
                            </span>
                        </div>
                        <div className={classes.totalRow}>
                            <strong>Shipping & Handling</strong>
                            <span>
                                <Price
                                    currencyCode={cart.totals.base_currency_code}
                                    value={order.shipping_amount}
                                />
                            </span>
                        </div>
                        <div className={classes.totalRow}>
                            <strong>Discount</strong>
                            <span>
                                <Price
                                    currencyCode={cart.totals.base_currency_code}
                                    value={order.discount_amount}
                                />
                            </span>
                        </div>
                        <div className={classes.grandTotalRow}>
                            <strong>Grand Total</strong>
                            <span>
                                <Price
                                    currencyCode={cart.totals.base_currency_code}
                                    value={order.grand_total}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ cart }) => ({ cart });

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        null
    )
)(OrderDetail);
