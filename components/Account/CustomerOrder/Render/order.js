import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import Button from 'src/components/Button';
import defaultClasses from './order.css';
import { connect } from 'src/drivers';
import { compose } from 'redux';
import classify from 'src/classify';
import { Price } from '@magento/peregrine';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';

const RE_ORDER = gql`
  mutation reorder($order: Int!) {
    reorder(order: $order)
  }
`;

class OrderRender extends Component {
    static propTypes = {
        classes: shape({
            root: string
        })
    };

    
    viewOrder = () => {
        this.setState(() => ({
            isPopupOrderDetailsOpen: true
        }));
    };

    reorder = () => {
        const { order,client, history } = this.props;

        this.setState({ isLoading: true });
        client.mutate({
            mutation: RE_ORDER,
            variables: { order: order.entity_id }
        }).then(result => {
            console.log(result);
            history.push('/cart.html');
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            this.setState({ isLoading: false });

        });
    };

    hideOrderViewPopup = () => {
        this.setState(() => ({
            isPopupOrderDetailsOpen: false
        }));
    };

    render() {
        const { classes, order, viewOrder, currency, currentUser } = this.props;
        const firstname = order.customer_firstname ? order.customer_firstname : currentUser.firstname;
        const lastname = order.customer_firstname ? order.customer_firstname : currentUser.lastname;

        return (
            <div className={classes.orderItem}>
                <div className={classes.orderId} data-heading="Order #">{order.increment_id}</div>
                <div className={classes.orderDate} data-heading="Date">{order.created_at}</div>
                <div className={classes.shipTo} data-heading="Ship To">
                    {firstname} {lastname}
                </div>
                <div className={classes.orderTotal} data-heading="Order Total">
                    <Price
                        currencyCode={currency}
                        value={parseFloat(order.grand_total)}
                    />
                </div>
                <div className={classes.orderStatus} data-heading="Status">{order.status}</div>
                <div className={classes.actions} data-heading="Actions">
                    <Button priority="high" onClick={() => viewOrder(order)}>View Order</Button>
                    <Button priority="high" onClick={this.reorder}>Reorder</Button>
                </div>
            </div>
        );
    }
}
const mapStateToProps = ({ cart, user }) => {
    const { currency } = cart;
    const { currentUser } = user;
    return {
        currency,
        currentUser
    }
};
export default compose(
    withRouter,
    withApollo,
    classify(defaultClasses),
    connect(
        mapStateToProps,
        null
    )
)(OrderRender);