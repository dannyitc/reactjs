import { connect } from 'react-redux';
import FilterModal from './filterModal';
import catalogActions from 'src/actions/catalog';

const mapStateToProps = ({ catalog }) => {
    const { chosenFilterOptions,originFilterOptions,currentFilterOptions } = catalog;
    return {
        chosenFilterOptions,
        originFilterOptions,
        currentFilterOptions
    };
};

const mapDispatchToProps = {
    updateChosenFilterOptions: catalogActions.updateChosenFilterOptions
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FilterModal);
