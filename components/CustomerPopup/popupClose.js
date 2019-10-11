import React, { Component, Fragment } from 'react';
import { func, shape, string } from 'prop-types';

import classify from 'src/classify';
import Trigger from 'src/components/Trigger';
import defaultClasses from './popupClose.css';

class PopupClose extends Component {
    static propTypes = {
        classes: shape({
            title: string
        }),
        onClose: func.isRequired
    };

    render() {
        const { classes, onClose } = this.props;
        return (
            <Fragment>
                <div className={classes.popupCloseClass}>
                    <Trigger className={classes.popupClose} key="closeButton" action={onClose} />
                </div>
            </Fragment>
        );
    }
}

export default classify(defaultClasses)(PopupClose);
