import { connect } from 'src/drivers';
import Gallery from './gallery';
import { createLoadingSelector } from '../../selectors/loading';

const requests = [
    'CART/ADD_ITEM/',
    'CART/GET_CART_DATA/'
];

const loadingSelector = createLoadingSelector(requests);

const mapStateToProps = ({ user, loading }) => {
    const { isSignedIn } = user;
    return {
        isSignedIn,
        isFetching: loadingSelector(loading)
    };
};

export default connect(
    mapStateToProps,
    null
)(Gallery);
