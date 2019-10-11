import { connect } from 'src/drivers';
import { closePopup } from 'src/actions/app';
import {
    completePasswordReset,
    createAccount,
    getUserDetails,
    resetPassword
} from 'src/actions/user';
import CustomerPopup from './customerPopup';
import { createLoadingSelector } from '../../selectors/loading';

const requests = [
    'USER/SIGN_IN/',
    'USER/RESET_PASSWORD/',
    'USER/CREATE_ACCOUNT/',
    'CART/GET_DETAILS/'
];

const loadingSelector = createLoadingSelector(requests);

const mapStateToProps = ({ user, app, loading }) => {
    const { formType } = app;
    const { currentUser, isSignedIn, forgotPassword } = user;
    const { email } = currentUser;
    return {
        formType,
        isSignedIn,
        email,
        forgotPassword,
        isFetching: loadingSelector(loading)
    };
};

const mapDispatchToProps = {
    closePopup,
    completePasswordReset,
    createAccount,
    getUserDetails,
    resetPassword
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomerPopup);
