import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { func, shape, string, object } from 'prop-types';
import { Form } from 'informed';
import { compose } from 'redux';
import classify from 'src/classify';
import getQueryParameterValue from 'src/util/getQueryParameterValue';
import Select from 'src/components/Select';
import defaultClasses from './limiter.css';
class Limiter extends Component {
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
        this.syncLimiter();
    }

    componentDidUpdate() {
        this.syncLimiter();
    }

    handleChangeLimiter = event => {
        this.setLimiter(event.target.value);
    }

    setLimiter = (limitValue, shouldReplace = false) => {
        const { history, location } = this.props;
        const { search } = location;
        const queryParams = new URLSearchParams(search);
        const method = shouldReplace ? 'replace' : 'push';

        queryParams.set('product_list_limit', limitValue);
        history[method]({ search: queryParams.toString() });
    };

    syncLimiter = () => {
        const { location, limiterControl } = this.props;
        const { currentLimit, setLimit } = limiterControl;

        const queryLimit = getQueryParameterValue({
            location,
            queryParameter: 'product_list_limit'
        });

        if (queryLimit != currentLimit && queryLimit != '') {
            setLimit(queryLimit);
        }
    };

    render() {
        const { classes, field, items, limiterControl } = this.props;
        const {currentLimit} = limiterControl;

        let fieldState = {
            value: currentLimit
        }
        const positionLimit = this.props.position == 'bottom' ? classes.limiterFormBottom : null;

        return (
            <Form className={`${classes.limiterForm} ${positionLimit}`}>
                <span>{"Show"}</span>
                <div className={classes.limiterSelection}>
                    <Select
                        field={field}
                        items={items}
                        fieldState={fieldState}
                        onChange={this.handleChangeLimiter}
                    />
                </div>
                {/* <span>{"per page"}</span> */}
            </Form>
        );
    }
}

export default compose(
    withRouter,
    classify(defaultClasses)
)(Limiter);
