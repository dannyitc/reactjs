import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './swatchOption.css';

class SwatchOption extends Component {
    static propTypes = {
        classes: PropTypes.shape({}),
        updateChosenItems: PropTypes.func
    };

    chooseOption = option => {
        const { setFilter, code} = this.props;
        setFilter(option,code);
    };

    render() {
        const { classes, items, code } = this.props;
        
        return (
            <div className={classes.colorOptionContainer}>
                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => this.chooseOption(item)}
                        className={classes.colorOptionItem}
                        style={code == 'fashion_color' || code == 'color' ? { backgroundColor: item.text } : {}}
                    >
                    {code == 'fashion_size' || code == 'size' ? item.name :''}
                    </button>
                ))}
            </div>
        );
    }
}

export default classify(defaultClasses)(SwatchOption);
