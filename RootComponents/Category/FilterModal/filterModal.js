import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';
import findIndex from 'lodash/findIndex';
import classify from 'src/classify';
import { object } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Icon from 'src/components/Icon';
import xIcon from 'react-feather/dist/icons/x';
import FilterOption from './FilterOption';
import AttributeOption from './AttributeOption';
import SwatchOption from './SwatchOption';
import defaultClasses from './filterModal.css';
import globalClasses from 'src/index.css';
import { arrayToObject } from 'src/functions';
import Skeleton from 'react-loading-skeleton';

const iconAttrs = {
    width: 16
};

const swatchAttrs = [
    'fashion_color',
    'fashion_size',
    'color',
    'size'
];

class FilterModal extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            searchFilterContainer: PropTypes.string,
            closeFilterModal: PropTypes.string
        }),
        history: object,
        location: object,
        closeModalHandler: PropTypes.func,
        chosenFilterOptions: PropTypes.array,
        updateChosenFilterOptions: PropTypes.func
    };

    state = {
        areOptionsPristine: true,
        expandedOptions: {}
    };

    componentDidMount() {
        this.props.isLoading || this.syncFilter();
    }

    componentDidUpdate() {
        this.props.isLoading || this.syncFilter();
    }

    resetFilterOptions = () => {
        const { history, location, chosenFilterOptions } = this.props;
        const { search } = location;
        const queryParams = new URLSearchParams(search);

        chosenFilterOptions.forEach((option) => {
            queryParams.delete(option.code);
        });
        history['push']({ search: queryParams.toString() });
    }

    removeOption = option => {
        const { history, location } = this.props;
        const { search } = location;
        const queryParams = new URLSearchParams(search);

        queryParams.delete(option.code);
        history['push']({ search: queryParams.toString() });
    }

    setFilter = (option, code, shouldReplace = false) => {
        const { history, location } = this.props;
        const { search } = location;
        const queryParams = new URLSearchParams(search);
        const method = shouldReplace ? 'replace' : 'push';
        const value = option.value.split(',')[0];

        queryParams.set(code, value);
        history[method]({ search: queryParams.toString() });

        const { modalIsOpen } = globalClasses;
        const bodyClasses = document.querySelector('body').classList;

        if (bodyClasses.contains(modalIsOpen)) {
            bodyClasses.remove(modalIsOpen);
        }
    }

    syncFilter = () => {
        const { location, updateChosenFilterOptions, originFilterOptions, categoryId, chosenFilterOptions } = this.props;
        const { search } = location;
        const filterOptions = originFilterOptions[categoryId] ? originFilterOptions[categoryId] : [];
        const filtersObject = arrayToObject(filterOptions, 'code');

        const queryParams = new URLSearchParams(search);
        let chosenOptions = [];

        for (let p of queryParams) {
            if (filtersObject.hasOwnProperty(p[0])) {
                let index = findIndex(filtersObject[p[0]].items, function (item) { return item.value == p[1] });
                if (index !== -1) {
                    chosenOptions.push({
                        name: filtersObject[p[0]].items[index].name,
                        value: p[1],
                        type: filtersObject[p[0]].name,
                        code: p[0]
                    });
                }
            }
        }

        if ((chosenOptions.length || chosenFilterOptions.length) &&
            JSON.stringify(chosenOptions) != JSON.stringify(chosenFilterOptions)) {
            {
                updateChosenFilterOptions(chosenOptions);
            }
        }

    };

    getIsExpanded = optionName => {
        return !!this.state.expandedOptions[optionName];
    };

    toggleOption = optionName => {
        const { expandedOptions } = this.state;
        this.setState({
            expandedOptions: Object.assign({}, expandedOptions, {
                [optionName]: !expandedOptions[optionName]
            })
        })
    };

    get currentStates() {
        const { chosenFilterOptions, classes } = this.props;
        if (!chosenFilterOptions.length) {
            return null;
        }
        return (
            <div className={classes.shopByCurrent}>
                <div className={classes.header}>
                    <span className={classes.headerTitle}>
                        Now Shopping by
                        </span>
                </div>
                <div className={classes.shopByCurrentContent}>
                    <ul>
                        {
                            chosenFilterOptions.map((filterOption, index) => (
                                <li key={index} >
                                    <button onClick={() => this.removeOption(filterOption)}><Icon src={xIcon} attrs={iconAttrs} /></button>
                                    <span className={classes.filterTitle}>{filterOption.type}:</span>
                                    <span dangerouslySetInnerHTML={{
                                        __html: filterOption.name
                                    }}
                                    ></span>
                                </li>
                            ))
                        }
                    </ul>
                    <button className={classes.removeAll} onClick={() => this.resetFilterOptions()}>Clear All</button>
                </div>
            </div>
        );
    }

    get shoppingOptions() {
        const {
            classes,
            closeModalHandler,
            chosenFilterOptions,
            updateChosenFilterOptions,
            filters
        } = this.props;

        if (!Array.isArray(filters) || !filters.length)
            return null;

        const filterOptions = filters.map((filter, index) => Object.assign(filter,
            {
                id: index,
                RenderOption: swatchAttrs.indexOf(filter.code) !== -1 ? SwatchOption : AttributeOption
            }
        ));

        return (
            <Fragment>
                <div className={classes.header}>
                    <span className={classes.headerTitle}>
                        Shopping Options
                    </span>
                    <button
                        className={classes.closeFilterModal}
                        onClick={closeModalHandler}
                    >
                        <Icon src={xIcon} attrs={iconAttrs} />
                    </button>
                </div>
                <List
                    items={filterOptions}
                    getItemKey={({ id }) => id}
                    render={props => (
                        <ul className={classes.filterOptionsContainer}>
                            {props.children}
                        </ul>
                    )}
                    renderItem={props => (
                        <li className={classes.filterOptionItem}>
                            <FilterOption
                                {...props}
                                toggleOption={this.toggleOption}
                                isExpanded={this.getIsExpanded(props.item.name)}
                                chosenFilterOptions={chosenFilterOptions}
                                updateChosenFilterOptions={chosenItems =>
                                    updateChosenFilterOptions(chosenItems)
                                }
                                setFilter={this.setFilter}
                            />
                        </li>
                    )}
                />
            </Fragment>
        );
    }

    render() {
        const {
            classes,
            isLoading
        } = this.props;

        if (isLoading) {
            return (
                <div className={classes.root}>
                    <Skeleton count={10} />
                </div>
            );
        }

        return (
            <div className={classes.root}>
                {this.currentStates}
                {this.shoppingOptions}
            </div>
        );
    }
}

export default compose(
    withRouter,
    classify(defaultClasses)
)(FilterModal);
