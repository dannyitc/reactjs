import { connect } from 'src/drivers';

import { goToAccountPage, goToWishListPage, signOut } from 'src/actions/user';
import TopLink from './topLink';
import {
    openComparePopup
} from 'src/actions/catalog';

const mapStateToProps = ({ user }) => {
    const { isSignedIn, selectedTabIndex } = user;
    return {
        isSignedIn,
        selectedTabIndex
    };
};

const mapDispatchToProps = {
    goToAccountPage,
    goToWishListPage,
    openComparePopup,
    signOut
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopLink);
