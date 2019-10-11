import { connect } from 'src/drivers';
import { closeDrawer } from 'src/actions/app';
import { getProductConfig } from 'src/actions/catalog';

import Navigation from './navigation';

const mapStateToProps = ({ catalog, user }) => {
    const { rootCategoryId, currentCategoryId, currentParrentId } = catalog;
    const { isSignedIn } = user;

    return {
        isSignedIn,
        rootCategoryId,
        currentCategoryId,
        currentParrentId
    };
};

const mapDispatchToProps = {
    closeDrawer,
    getProductConfig
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);
