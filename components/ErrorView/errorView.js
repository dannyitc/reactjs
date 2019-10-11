import React, { Component } from 'react';
import classify from 'src/classify';
import defaultClasses from './errorView.css';
const messages = new Map()
    .set('loading', '')
    .set('notFound', '404 Not Found')
    .set('internalError', '500 Internal Server Error');

class ErrorView extends Component {
    render() {
        const { classes, loading, notFound } = this.props;
        const message = loading
            ? messages.get('loading')
            : notFound
            ? messages.get('notFound')
            : messages.get('internalError');

        return <h1 className={classes.errorMsg}>{message}</h1>;
    }
}
export default classify(defaultClasses)(ErrorView);
