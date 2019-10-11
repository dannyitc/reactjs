import React, { Component } from 'react';
import { func, shape, number, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './categoryLeaf.css';

const iconAttrs = {
    width: 14
};

class Branch extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            text: string
        }),
        name: string.isRequired,
        path: string.isRequired,
        onDive: func.isRequired
    };

    handleClick = () => {
        const { path, onDive } = this.props;

        onDive(path);
    };


    render() {
        const { classes } = this.props;

        return (
            <button className={classes.optionToggleMenu} onClick={this.handleClick} />
        );
    }
}

export default classify(defaultClasses)(Branch);
