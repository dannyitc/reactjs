import React, { Component, Fragment } from 'react';
import { connect } from 'src/drivers';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import { withRouter } from 'react-router-dom';
import Button from 'src/components/Button';
import { togglePopup } from 'src/actions/app';
import defaultClasses from './topLink.css';
import globalClasses from 'src/index.css';
import CompareList from 'src/components/CompareList';
import Modal from "react-animated-modal";

class TopLink extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        history: PropTypes.object,
        isSignedIn: PropTypes.bool,
        isOpen: PropTypes.bool,
    };

    goToAccountPage = () => {
        const { history, goToAccountPage } = this.props;
        goToAccountPage(history);
    }

    goToWishListPage = () => {
        const { history, goToWishListPage } = this.props;
        goToWishListPage(history);
    }

    signOut = () => {
        const { history, signOut } = this.props;
        signOut(history);
    }

    showComparePopup = () => {
        const { modalIsOpen } = globalClasses;
        const bodyClasses = document.querySelector('body').classList;
        this.props.openComparePopup(true);
        bodyClasses.add(modalIsOpen)
    };

    hideComparePopup = () => {
        const { modalIsOpen } = globalClasses;
        const bodyClasses = document.querySelector('body').classList;
        this.props.openComparePopup(false);
        bodyClasses.remove(modalIsOpen)
    };

    get comparePopup() {
        const {
            classes,
            isPopupCompareOpen
        } = this.props;
        return (
            <Modal visible={isPopupCompareOpen} closemodal={this.hideComparePopup} type="slideInUp">
                <div className={classes.popupWrapper}>
                    <div className={classes.popupContent}>
                        <CompareList />
                    </div>
                </div>
            </Modal>
        );
    }

    render() {
        const { classes, openSignIn, openCreate, isSignedIn, isOpen } = this.props;
        const className = isOpen ? classes.root_open : classes.root;
        return (
            <Fragment>
                {this.comparePopup}
                {!isSignedIn ?
                    <div className={className}>
                        <div className={classes.headerLinkItem}>
                            <Button priority="high" onClick={openSignIn}>
                                My Account
                            </Button>
                            <Button priority="high" onClick={openSignIn}>
                                My Wishlist
                            </Button>
                            <Button priority="high" onClick={this.showComparePopup}>
                                Compare
                            </Button>
                            <Button priority="high" onClick={openSignIn}>
                                Sign In
                            </Button>
                            <Button priority="high" onClick={openCreate}>
                                Create an Account
                            </Button>
                        </div>
                    </div>
                    :
                    <div className={className}>
                        <div className={classes.headerLinkItem}>
                            <Button priority="high" onClick={this.goToAccountPage}>
                                My Account
                            </Button>
                            <Button priority="high" onClick={this.goToWishListPage}>
                                My Wishlist
                            </Button>
                            <Button priority="high" onClick={this.showComparePopup}>
                                Compare
                            </Button>
                            <Button priority="high" onClick={this.signOut}>
                                Sign Out
                            </Button>
                        </div>
                    </div>
                }
            </Fragment>
        );
    }
}

const mapStateToProps = ({ catalog }) => {
    return {
        isPopupCompareOpen: catalog.isPopupCompareOpen
    };
};

const mapDispatchToProps = dispatch => ({
    openSignIn: () => dispatch(togglePopup('signIn')),
    openCreate: () => dispatch(togglePopup('create')),
});

export default compose(
    withRouter,
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(TopLink);
