import { connect } from 'src/drivers';

import Review from './review';
import { addReview } from 'src/actions/catalog';


const mapDispatchToProps = {
    addReview
};

export default connect(
    null,
    mapDispatchToProps
)(Review);
