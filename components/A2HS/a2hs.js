import React, { Component } from 'react';
import classify from 'src/classify';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Icon from 'src/components/Icon';
import shareIcon from 'react-feather/dist/icons/share';
import defaultClasses from './a2hs.css';
import Logo from './tigren-logo.svg';
import xIcon from 'react-feather/dist/icons/x';
class A2HS extends Component {
    constructor() {
        super();
        this.state = {
            isPopupOpen: true
        };
    }

    hidePopup = () => {
        this.setState(() => ({
            isPopupOpen: false
        }));
    };

    render() {
        const { classes, showA2HSPopup } = this.props;
        const { isPopupOpen } = this.state;

        const className = isPopupOpen ? classes.root_open : classes.root;

        if (!showA2HSPopup) {
            return null;
        }

        return (
            <div className={className}>
                <div className={classes.a2hsPopup}>
                    <button className={classes.hidePopup} priority="high" onClick={this.hidePopup}>
                        <Icon src={xIcon} size={20} />
                    </button>
                    <p className={classes.popupMsg}><img className={classes.logo}
                        src={Logo}
                        alt="Tigren"
                        title="Tigren"
                    />Install this web app on your device: tap <span className={classes.share}><Icon src={shareIcon} size={20} /></span>  and then "Add to Home Screen"</p>

                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ app }) => {
    const { showA2HSPopup } = app;
    return {
        showA2HSPopup
    }
};

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        null
    )
)(A2HS);