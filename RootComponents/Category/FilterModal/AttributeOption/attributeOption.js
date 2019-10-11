import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './attributeOption.css';
import { compose } from 'redux';
import { connect } from 'src/drivers';

class AttributeOption extends Component {
    static propTypes = {
        classes: PropTypes.shape({})
    };

    handleChooseOption = option => {
        const { setFilter, code } = this.props;
        setFilter(option, code);
    };

    render() {
        const { classes, items, code, layered_display_count } = this.props;

        return (
            <div className={classes.optionContainer}>
                <ul>
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className={classes.optionItem}
                            onClick={() => this.handleChooseOption(item)}
                        >
                            {code == 'price'
                                ? <span dangerouslySetInnerHTML={{ __html: item.name }}></span>
                                : <span>{item.name}</span>
                            }
                            {layered_display_count && <span>({item.count})</span>}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = ({ catalog }) => {
    const {
        layered_display_count
    } = catalog.storeConfig;
    return {
        layered_display_count
    };
};

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        null
    )
)(AttributeOption);
