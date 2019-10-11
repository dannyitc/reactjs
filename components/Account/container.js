import { connect } from 'src/drivers';
import {
    getUserDetails
} from 'src/actions/user';

const mapStateToProps = ({ user }) => {
    const { currentUser, isSignedIn } = user;
    return {
        currentUser,
        isSignedIn,
    };
};

const mapDispatchToProps = {
    getUserDetails
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
