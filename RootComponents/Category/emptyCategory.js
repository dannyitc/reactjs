import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './emptyCategory.css';

class EmptyCategory extends Component {
    static propTypes = {
        classes: shape({
            root: string
        })
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.emptyMsg}>
                    <p>We can't find products matching the selection</p>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(EmptyCategory);
