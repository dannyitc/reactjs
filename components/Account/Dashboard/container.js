import { connect } from 'src/drivers';
import CustomerDashBoard from './dashboard';
import {
    getUserDetails,
    goToAccountPage,
    viewProfilePage, 
    viewOrderHistory,
    manageAddressesPage,
    goToWishListPage
} from 'src/actions/user';

const mapStateToProps = ({ user }) => {
    const { currentUser, isSignedIn } = user;
    return {
        currentUser,
        isSignedIn,
    };
};

const mapDispatchToProps = {
    getUserDetails,
    goToAccountPage,
    viewProfilePage, 
    viewOrderHistory,
    manageAddressesPage,
    goToWishListPage
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomerDashBoard);
