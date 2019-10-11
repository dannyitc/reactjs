import { connect } from 'src/drivers';
import { withApollo } from 'react-apollo';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { viewOrderHistory, createAccount } from 'src/actions/user';
import actions from 'src/actions/checkoutReceipt';

import CreateAccountPage from './createAccountPage';
import { createLoadingSelector } from '../../selectors/loading';

const {reset} = actions;
const requests = [
    'USER/CREATE_ACCOUNT/'
];

const loadingSelector = createLoadingSelector(requests);

const mapStateToProps = ({ loading, checkoutReceipt }) => {
    const { orderId } = checkoutReceipt;
    return {
        orderId,
        isFetching: loadingSelector(loading)
    };
};

const mapDispatchToProps = {
    viewOrderHistory,
    createAccount,
    reset
};

export default compose(
    withApollo,
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(CreateAccountPage);
