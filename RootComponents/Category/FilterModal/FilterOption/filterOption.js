import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { object } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import classify from 'src/classify';
import Icon from 'src/components/Icon';
import chevronUpIcon from 'react-feather/dist/icons/chevron-up';
import chevronDownIcon from 'react-feather/dist/icons/chevron-down';
import defaultClasses from './filterOption.css';

const iconAttrs = {
    width: 20
};

class FilterOption extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        history: object,
        location: object,
        item: PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            items: PropTypes.array,
            RenderOption: PropTypes.func
        }),
        chosenFilterOptions: PropTypes.array,
        updateChosenFilterOptions: PropTypes.func,
        isExpanded: PropTypes.bool
    };

    resetChosenItems = () => {
        this.updateChosenItems([]);
    }

    optionToggle = () => {
        const {
            toggleOption,
            item: { name }
        } = this.props;
        toggleOption(name);
    };

    onKeyPressHandler = () => {
        return true;
    };

    render() {
        const {
            classes,
            item: { name, code, items, RenderOption },
            chosenFilterOptions,
            isExpanded,
            filters,
            setFilter
        } = this.props;
        const chosenOptions = chosenFilterOptions;

        return (
            <div className={classes.root}>
                <div className={classes.optionHeader}
                    onClick={this.optionToggle}
                    onKeyPress={this.onKeyPressHandler}
                    role="button"
                    tabIndex="0"
                >
                    <div className={classes.optionName}>{name}</div>
                    <div className={classes.counterAndCloseButtonContainer}>
                        <button
                            onClick={this.optionToggle}
                            className={classes.optionToggleButton}
                        >
                            <Icon attrs={iconAttrs}
                                src={
                                    isExpanded ? chevronUpIcon : chevronDownIcon
                                }
                            />
                        </button>
                    </div>
                </div>
                {isExpanded ? (
                    <RenderOption
                        filters={filters}
                        code={code}
                        items={items}
                        chosenOptions={chosenOptions}
                        updateChosenItems={this.updateChosenItems}
                        setFilter={setFilter}
                    />
                ) : null}
            </div>
        );
    }
}

export default compose(
    withRouter,
    classify(defaultClasses)
)(FilterOption);
