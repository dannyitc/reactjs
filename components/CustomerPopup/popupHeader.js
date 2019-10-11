import React, { Component, Fragment } from 'react';
import { func, shape, string } from 'prop-types';

import classify from 'src/classify';
import Icon from 'src/components/Icon';
import Trigger from 'src/components/Trigger';
import CloseIcon from 'react-feather/dist/icons/x';
import defaultClasses from './popupHeader.css';

class PopupHeader extends Component {
    static propTypes = {
        classes: shape({
            title: string
        }),
        title: string
    };

    render() {
        const { classes, title } = this.props;
        return (
            <Fragment>
                <div className={classes.popupHeaderClass}>
                    <h2 key="title" className={classes.title}>
                        <span>{title}</span>
                    </h2>
                </div>
            </Fragment>
        );
    }
}

export default classify(defaultClasses)(PopupHeader);
