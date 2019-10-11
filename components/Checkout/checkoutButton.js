import React, { Component } from 'react';
import { bool, func } from 'prop-types';

import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import ArrowRightIcon from 'react-feather/dist/icons/chevron-right';
import { togglePopup } from 'src/actions/app';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const isDisabled = (busy, valid) => busy || !valid;

class CheckoutButton extends Component {
    static propTypes = {
        ready: bool.isRequired,
        submit: func,
        submitting: bool
    };

    goToCheckoutPage = () => {
        const { history, allow_guest_checkout, isSignedIn, openSignIn } = this.props;
        if (allow_guest_checkout || isSignedIn) {
            history.push('/checkout.html');
            return;
        }
        openSignIn();
    };

    render() {
        const { ready, submitting, disable } = this.props;
        let disabled = isDisabled(submitting, ready);
        if(disable){
            disabled = true;
        }

        return (
            <Button
                name="proceed-to-checkout"
                priority="high"
                disabled={disabled}
                onClick={this.goToCheckoutPage}
            >
                <span>Go to Checkout</span>
            </Button>
        );
    }
}

const mapStateToProps = state => {
    const { user, catalog } = state;
    return {
        isSignedIn: user.isSignedIn,
        allow_guest_checkout: catalog.storeConfig.allow_guest_checkout
    };
};

const mapDispatchToProps = dispatch => ({
    openSignIn: () => dispatch(togglePopup('signIn'))
});

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(CheckoutButton);
