import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './Feature.css';

class Feature extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            filterContainer: PropTypes.string,
            featureContainer: PropTypes.string,
            featureItem: PropTypes.string,
            iconShipped: PropTypes.string,
            iconUsDollar: PropTypes.string,
            iconOnlineSupport: PropTypes.string,
            iconReply: PropTypes.string,
            iconFilterButton: PropTypes.string
        })
    };

    render() {
        const { classes, customClass } = this.props;
        const getCustomClass = customClass == 'featureProduct' ? classes.featureProduct : '';
        return (
            <div className={`${classes.featureContainer} ${getCustomClass}`}>
                <div className={classes.featureItem}>
                    <span className={classes.iconShipped} />
                    <h3>{'FREE SHIPPING'}</h3>
                    <h3 style={{ fontSize: 12 }}>{'For all UK orders'}</h3>
                </div>
                <div className={classes.featureItem}>
                    <span className={classes.iconUsDollar} />
                    <h3>
                        {'100% MONEY'}
                        <br />
                        {'BACK GUARANTEE'}
                    </h3>
                </div>
                <div className={classes.featureItem}>
                    <span className={classes.iconOnlineSupport} />
                    <h3>
                        {'ONLINE AND PHONE'}
                        <br />
                        {'SUPPORT'}
                    </h3>
                </div>
                <div className={classes.featureItem}>
                    <span className={classes.iconReply} />
                    <h3>{'FREE RETURNS'}</h3>
                    <h3 style={{ fontSize: 12 }}>{'For orders over £50'}</h3>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(Feature);
