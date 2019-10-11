import React, { Component } from 'react';
import { bool, node, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './field.css';

class Field extends Component {
    static propTypes = {
        children: node,
        classes: shape({
            label: string,
            root: string
        }),
        label: node,
        required: bool
    };

    get requiredSymbol() {
        const { classes, required } = this.props;
        return required ? <div className={classes.requiredSymbol} /> : null;
    }

    render() {
        const { children, classes, label } = this.props;

        return (
            <div className={classes.root}>
                <span className={classes.label}><span>{label}{this.requiredSymbol}</span></span>
                {children}
            </div>
        );
    }
}

export default classify(defaultClasses)(Field);
