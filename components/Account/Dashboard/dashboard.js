import React, { Component, Fragment } from 'react';
import { string, shape, array, object } from 'prop-types';
import classify from 'src/classify';
import findIndex from 'lodash/findIndex';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import EditIcon from 'react-feather/dist/icons/edit';
import AddressRender from '../Address/Render';
import { findDefaultAddress } from 'src/functions';
import AddressForm from '../Address/addressForm';
import defaultClasses from './dashboard.css';

import Modal from "react-animated-modal";

class CustomerDashBoard extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            emptyTitle: string,
            continue: string
        }),
        history: object,
        directory: shape({
            countries: array
        })
    };

    constructor() {
        super();
        this.state = {
            isPopupAddressFormOpen: false,
            isLoading: false,
            currentAddress: {}
        };
    }

    goToProfile = () => {
        const { history, viewProfilePage } = this.props;
        viewProfilePage(history);
    }

    goToAddressBook = () => {
        const { history, manageAddressesPage } = this.props;
        manageAddressesPage(history);
    }

    findDefaultAddress(user, type) {
        let index = findIndex(user.addresses, function (address) { return address[type] === true });
        return index !== -1 ? user.addresses[index] : {};
    }

    get addressFormPopup() {
        const {
            classes,
            submitting,
            isAddressIncorrect,
            incorrectAddressMessage,
            directory,
            getUserDetails
        } = this.props;
        const { countries } = directory;
        const { currentAddress, isPopupAddressFormOpen } = this.state;

        return (
            <Modal visible={isPopupAddressFormOpen} closemodal={this.hidePopup} type="slideInUp">
                <div className={classes.popupAddress}>
                    <div className={classes.popupWrapper}>
                        <div className={classes.popupContent}>
                            <AddressForm
                                address={currentAddress}
                                initialValues={currentAddress}
                                submitting={submitting}
                                countries={countries}
                                cancel={this.stopEditing}
                                isAddressIncorrect={isAddressIncorrect}
                                incorrectAddressMessage={incorrectAddressMessage}
                                getUserDetails={getUserDetails}
                                hidePopup={this.hidePopup}
                                isFirstAddress={false}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }

    editAddress(address) {
        this.setState({
            currentAddress: address,
            isPopupAddressFormOpen: true
        });
    }

    hidePopup = () => {
        this.setState(() => ({
            isPopupAddressFormOpen: false
        }));
    };

    render() {
        const { classes, currentUser } = this.props;
        const user = currentUser;
        const defaultBillingAddress = findDefaultAddress(user, 'default_billing');
        const defaultShippingAddress = findDefaultAddress(user, 'default_shipping');

        return (
            <div className={classes.dashboardContent}>
                <h1>My Account</h1>
                <h2>Account Information</h2>
                <div className={classes.dashboardContactInfo}>
                    <div className={classes.contactInfo}>
                        <strong className={classes.boxTitle}>
                            <span>Contact Information</span>
                        </strong>
                        <address>
                            <b>{user.firstname} {user.lastname}</b>
                            <br />
                            {user.email}
                        </address>
                        <div className={classes.boxActions}>
                            <Button priority="high" onClick={this.goToProfile}>
                                <Icon src={EditIcon} size={14} />
                                Edit
                                </Button>
                        </div>
                    </div>
                </div>
                <h2 className={classes.dashboardAddressesTitle}>
                    <span>Address Book</span>
                    <Button priority="high" onClick={this.goToAddressBook}>
                        Manage Address
                    </Button>
                </h2>
                <div className={classes.dashboardAddresses}>
                    {this.state.isPopupAddressFormOpen ? this.addressFormPopup : null}
                    <div className={classes.defaultBillingAddress}>
                        <strong className={classes.boxTitle}>
                            <span>Default Billing Address</span>
                        </strong>
                        {
                            defaultBillingAddress.id
                                ? <Fragment>
                                    <AddressRender address={defaultBillingAddress} />
                                    <div className={classes.boxActions}>
                                        <Button priority="high" onClick={this.editAddress.bind(this, defaultBillingAddress)}>
                                            <Icon src={EditIcon} size={14} />
                                            Edit Address
                                        </Button>
                                    </div>
                                </Fragment>
                                : <div>
                                    <p>You have not set a default billing address.</p>
                                </div>
                        }
                    </div>
                    <div className={classes.defaultShippingAddress}>
                        <strong className={classes.boxTitle}>
                            <span>Default Shipping Address</span>
                        </strong>
                        {
                            defaultShippingAddress.id
                                ? <Fragment>
                                    <AddressRender address={defaultShippingAddress} />
                                    <div className={classes.boxActions}>
                                        <Button priority="high" onClick={this.editAddress.bind(this, defaultShippingAddress)}>
                                            <Icon src={EditIcon} size={14} />
                                            Edit Address
                                        </Button>
                                    </div>
                                </Fragment>
                                : <div>
                                    <p>You have not set a default Shipping address.</p>
                                </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
export default compose(
    withRouter,
    classify(defaultClasses)
)(CustomerDashBoard);