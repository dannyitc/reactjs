import React, { Component } from 'react';
import { shape, string } from 'prop-types';
import { compose } from 'redux';
import classify from 'src/classify';
import defaultClasses from './slideItem.css';

export class Slide extends Component {
    static propTypes = {
        classes: shape({
            input: string
        })
    };

    render() {
        const { classes, image } = this.props;
        return <div className={classes.root}><img className={classes.image} src={image} alt='' /></div>;
    }
}

export default compose(classify(defaultClasses))(Slide);
