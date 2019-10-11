import { connect } from 'src/drivers';

import List from './list';
import {
    openComparePopup
} from 'src/actions/catalog';

const mapStateToProps = ({ catalog }) => {
    return {
        isPopupCompareOpen: catalog.isPopupCompareOpen
    };
};

const mapDispatchToProps = {
    openComparePopup
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(List);
