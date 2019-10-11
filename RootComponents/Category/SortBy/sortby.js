import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { func, shape, string, object } from 'prop-types';
import { Form } from 'informed';
import { compose } from 'redux';
import classify from 'src/classify';
import getQueryParameterValue from 'src/util/getQueryParameterValue';
import Select from 'src/components/Select';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import arrowUpIcon from 'react-feather/dist/icons/arrow-up';
import arrowDownIcon from 'react-feather/dist/icons/arrow-down';
import defaultClasses from './sortby.css';

const ASC = 'ASC';
const DESC = 'DESC';

const iconAttrs = {
    width: 14
};

class SortBy extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        history: object,
        location: object,
        sortByControl: shape({
            currentSortBy: string,
            setSortBy: func
        })
    };

    componentDidMount() {
        this.syncSortBy();
        this.syncDirection();
    }

    componentDidUpdate() {
        this.syncSortBy();
        this.syncDirection();
    }

    handleChangeSortBy = event => {
        this.setSortBy(event.target.value);
    }

    handleChangeDirection = () => {
        const queryDirection = getQueryParameterValue({
            location,
            queryParameter: 'dir'
        });
        this.setDirection(queryDirection != DESC ? DESC : ASC);
    }

    setDirection = (direction, shouldReplace = false) => {
        const { history, location } = this.props;
        const { search } = location;
        const queryParams = new URLSearchParams(search);
        const method = shouldReplace ? 'replace' : 'push';

        queryParams.set('dir', direction);
        history[method]({ search: queryParams.toString() });
    }

    setSortBy = (sortBy, shouldReplace = false) => {
        const { history, location } = this.props;
        const { search } = location;
        const queryParams = new URLSearchParams(search);
        const method = shouldReplace ? 'replace' : 'push';

        queryParams.set('sortBy', sortBy);
        history[method]({ search: queryParams.toString() });
    };

    syncSortBy = () => {
        const { location, sortByControl } = this.props;
        const { currentSortBy, setSortBy } = sortByControl;
        const listSortBy = ['position', 'price', 'name'];

        const querySortBy = getQueryParameterValue({
            location,
            queryParameter: 'sortBy'
        });

        if (querySortBy != currentSortBy && querySortBy != '') {
            if (!listSortBy.includes(querySortBy)) {
                this.setSortBy('position', true);
            } else {
                setSortBy(querySortBy);
            }
        }
    };

    syncDirection = () => {
        const { location, sortByControl } = this.props;
        const { currentDirection, setDirection } = sortByControl;
        const listDirection = [ASC,DESC];

        const queryDirection = getQueryParameterValue({
            location,
            queryParameter: 'dir'
        });

        if (queryDirection != currentDirection && queryDirection != '') {
            if (!listDirection.includes(queryDirection)) {
                this.setDirection(ASC, true);
            } else {
                setDirection(queryDirection);
            }
        }
    };

    render() {
        const { classes, field, items, sortByControl } = this.props;
        const {currentSortBy, currentDirection} = sortByControl;

        let fieldState = {
            value: currentSortBy
        }

        return (
            <Form className={classes.sortbyForm}>
                <label>{"Sort By"}</label>
                <div className={classes.sortbySelection}>
                    <Select
                        field={field}
                        items={items}
                        fieldState={fieldState}
                        onChange={this.handleChangeSortBy}
                    />
                </div>
                <button className={classes.sortbyDirection} onClick={this.handleChangeDirection}>
                    {currentDirection == 'DESC'
                        ? <Icon
                            src={arrowUpIcon}
                            attrs={iconAttrs}
                        />
                        : <Icon
                            src={arrowDownIcon}
                            attrs={iconAttrs}
                        />
                    }
                </button>
            </Form>
        );
    }
}

export default compose(
    withRouter,
    classify(defaultClasses)
)(SortBy);
