import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './orders.css';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import OrderDetail from './OrderDetail';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import OrderRender from './Render/order';

import Modal from "react-animated-modal";

const customerOrderQuery = gql`
    query customer {
        customer {
            id
            orders {
                entity_id
                increment_id
                created_at
                customer_firstname
                customer_lastname
                grand_total
                subtotal
                status
                payment_method
                shipping_amount
                shipping_description
                discount_amount
                shipping_address {
                    id
                    region
                    region_id
                    country_id
                    street
                    company
                    telephone
                    postcode
                    city
                    firstname
                    lastname
                }
                billing_address {
                    id
                    region
                    region_id
                    country_id
                    street
                    company
                    telephone
                    postcode
                    city
                    firstname
                    lastname
                }
                items {
                    id
                    name
                    sku
                    price
                    subtotal
                    quantity
                }
            }
        }
    }
`;

class CustomerOrder extends Component {
    static propTypes = {
        classes: shape({
            root: string
        })
    };

    constructor() {
        super();
        this.state = {
            isPopupOrderDetailsOpen: false,
            currentOrder: {}
        };
    }

    viewOrder = (order) => {
        this.setState(() => ({
            isPopupOrderDetailsOpen: true,
            currentOrder: order
        }));
    };

    hideOrderViewPopup = () => {
        this.setState(() => ({
            isPopupOrderDetailsOpen: false
        }));
    };

    get orderDetailsPopup() {
        const {
            classes
        } = this.props;
        const { isPopupOrderDetailsOpen, currentOrder } = this.state;

        return (
            <Modal className={classes.popupOrderDetail} visible={isPopupOrderDetailsOpen} closemodal={this.hideOrderViewPopup} type="slideInDown">
                <div className={classes.popupWrapper}>
                    <div className={classes.popupContent}>
                        <OrderDetail order={currentOrder} />
                    </div>
                </div>
            </Modal>
        );
    }

    render() {
        const { classes } = this.props;

        return (
            <Query
                query={customerOrderQuery}
                fetchPolicy={"cache-and-network"}
            >
                {({ loading, error, data }) => {
                    if (error) return null;
                    if (loading)
                        return loadingIndicator;
                    const orders = data.customer ? data.customer.orders : null;
                    if (!orders) return (
                        <div>
                            <p>You have no order.</p>
                        </div>
                    );
                    return (
                        <div className={classes.orderHistory}>
                            <h1>My Orders</h1>
                            {this.orderDetailsPopup}
                            <div className={classes.heading}>
                                <div className={classes.orderId}>Order #</div>
                                <div className={classes.orderDate}>Date</div>
                                <div className={classes.shipTo}>Ship To</div>
                                <div className={classes.orderTotal}>Order Total</div>
                                <div className={classes.orderStatus}>Status</div>
                                <div className={classes.actions}>Action</div>
                            </div>
                            <div className={classes.orderList}>
                                {
                                    orders.map(
                                        order => <OrderRender key={order.entity_id} order={order} viewOrder={this.viewOrder} />
                                    )
                                }
                            </div>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default classify(defaultClasses)(CustomerOrder);
