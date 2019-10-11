import { connect } from 'src/drivers';
import { closeDrawer } from 'src/actions/app';
import {
    completePasswordReset,
    createAccount,
    getUserDetails,
    resetPassword
} from 'src/actions/user';
import Header from './header';
import { toggleSearch, toggleCustomerMenu } from 'src/actions/app';

const mapStateToProps = ({ app, user }) => {
    const { searchOpen, customerLinksOpen, drawer, autocompleteOpen } = app;
    const { currentUser, isSignedIn, forgotPassword } = user;
    const { firstname, email, lastname } = currentUser;
    return {
        searchOpen,
        customerLinksOpen,
        drawer,
        autocompleteOpen,
        email,
        firstname,
        forgotPassword,
        isSignedIn,
        lastname,
    };
};

const mapDispatchToProps = { 
    toggleSearch,
    toggleCustomerMenu,
    closeDrawer,
    completePasswordReset,
    createAccount,
    getUserDetails,
    resetPassword
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
