import { connect } from 'src/drivers';

//import { goToAccountPage, goToWishListPage, signOut } from 'src/actions/user';
import CustomerOrder from './orders';

const mapStateToProps = ({ user }) => {
    const { isViewOrderById } = user;
    return {
        isViewOrderById
    };
};

// const mapDispatchToProps = {
//     goToAccountPage,
//     goToWishListPage,
//     signOut
// };

export default connect(
    mapStateToProps,
    null
)(CustomerOrder);
