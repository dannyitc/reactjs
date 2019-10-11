import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import { shape, string } from 'prop-types';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';

import defaultClasses from './verticaltab.css';

class VerticalTab extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        classes: shape({
            tabListItem: string,
            tabListItemActive: string
        }),
        icon: PropTypes.func
    };

    onClick = () => {
        const { tabIndex, onClick } = this.props;
        onClick(tabIndex);
    };

    render() {
        const {
            onClick,
            props: { tabIndex, selectedIndex, label, icon }
        } = this;

        const { classes } = this.props;

        if (selectedIndex === tabIndex) {
            classes.tabListItem = classes.tabListItemActive;
        }

        return (
            <div className={classes.tabListItem} >
                <Button onClick={onClick}>
                    <Icon src={icon} />
                    {label}
                </Button>
            </div>
        );
    }
}

export default classify(defaultClasses)(VerticalTab);
