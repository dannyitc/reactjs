import React, { Component } from 'react';
import { func, object, shape } from 'prop-types';
import classify from 'src/classify';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Button from 'src/components/Button';
import CreateAccount from 'src/components/CreateAccount';
import SignIn from 'src/components/SignIn';
import ForgotPassword from 'src/components/ForgotPassword';
import defaultClasses from './customerPopup.css';
import './modalPopup.scss';
import PopupHeader from './popupHeader';
import { togglePopup } from 'src/actions/app';
import { config } from 'src/config';
import LoadingIndicator from 'src/components/LoadingIndicator';
import Modal from "react-animated-modal";

class CustomerPopup extends Component {
    static propTypes = {
        classes: shape({

        }),
        history: object,
        closePopup: func.isRequired
    };

    get signInForm() {
        const { classes, openCreate, openForgot } = this.props;
        return (
            <div className={classes.signInPopup}>
                <div className={classes.signInForm}>
                    <SignIn />
                    <div className={classes.forgotPassword}>
                        <Button onClick={openForgot}>
                            Forgot password?
                        </Button>
                    </div>
                    <div className={classes.showCreateAccountButton}>
                        <Button priority="high" className={classes.showCreateAccountButton} onClick={openCreate}>
                            Create an Account
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    createAccount = accountInfo => {
        const { createAccount } = this.props;
        createAccount(accountInfo);
    };

    get createAccountForm() {
        const { classes, formType, openSignIn, openForgot } = this.props;
        const className = formType == 'create' ? classes.createAccountFormOpen : classes.createAccountFormClose;

        return (
            <div className={className}>
                <CreateAccount onSubmit={this.createAccount} />
                <div className={classes.actions}>
                    <div className={classes.showForgotForm}>
                        <Button onClick={openForgot}>
                            Forgot password?
                        </Button>
                    </div>
                    <div className={classes.showSignIn}>
                        <Button onClick={openSignIn}>
                            Sign In
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    get forgotPasswordForm() {
        const { classes, formType, openSignIn, completePasswordReset, forgotPassword, resetPassword, closePopup, openCreate } = this.props;
        const className = formType == 'forgot' ? classes.forgotPassFormOpen : classes.forgotPassFormClose;
        const { email, isInProgress } = forgotPassword;

        return (
            <div className={className}>
                <ForgotPassword
                    completePasswordReset={completePasswordReset}
                    email={email}
                    isInProgress={isInProgress}
                    resetPassword={resetPassword}
                    onClose={closePopup}
                />
                <div className={classes.actions}>
                    <div className={classes.showSignIn}>
                        <Button onClick={openSignIn}>
                            Sign In
                        </Button>
                    </div>
                    <div className={classes.showCreateAccountButton}>
                        <Button priority="high" className={classes.showCreateAccountButton} onClick={openCreate}>
                            Create an Account
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { classes, isSignedIn, isOpen, closePopup, formType, isFetching } = this.props;
        const visible = !!formType && !isSignedIn && isOpen;
        const type = config.popup_animation;
        let title = '', form = null;

        if (!formType) {
            return null;
        }
        switch (formType) {
            case 'signIn':
                title = 'Customer Login';
                form = this.signInForm;
                break;
            case 'create':
                title = 'Create New Customer Account';
                form = this.createAccountForm;
                break;
            case 'forgot':
                title = 'Forgot Your Password';
                form = this.forgotPasswordForm;
                break;
            default:
                break;
        }
        return (
            <Modal visible={visible} closemodal={closePopup} type={type}>
                <div className={classes.popupWrapper}>
                    <div className={classes.popupContent}>
                        <PopupHeader
                            title={title}
                            onClose={closePopup}
                        />
                        {isFetching ? <div className={classes.loading}>
                            <LoadingIndicator />
                        </div> : null}
                        {form}
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    openSignIn: () => dispatch(togglePopup('signIn')),
    openCreate: () => dispatch(togglePopup('create')),
    openForgot: () => dispatch(togglePopup('forgot'))
});

export default compose(
    classify(defaultClasses),
    connect(
        null,
        mapDispatchToProps
    )
)(CustomerPopup);