import { connect } from 'src/drivers';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { continueShopping, createAccount } from 'src/actions/checkout';
import Receipt from './receipt';
import { viewOrderHistory } from 'src/actions/user';

const mapStateToProps = ({ checkoutReceipt }) => {
    const { order } = checkoutReceipt;
    return {
        order
    };
};

const mapDispatchToProps = {
    continueShopping,
    createAccount,
    viewOrderHistory
};

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Receipt);
