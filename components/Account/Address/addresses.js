import React, { Component, Fragment } from 'react';
import { string, shape, array, object } from 'prop-types';
import { compose } from 'redux';
import classify from 'src/classify';
import defaultClasses from './addresses.css';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import EditIcon from 'react-feather/dist/icons/edit';
import DeleteIcon from 'react-feather/dist/icons/trash-2';
import { withApollo } from 'react-apollo';
import { findDefaultAddress } from 'src/functions';

import AddressForm from './addressForm';
import AddressRender from './Render';

import { deleteCustomerAddress } from 'src/mutations/deleteCustomerAddress';
import { loadingIndicator } from 'src/components/LoadingIndicator';

import Modal from "react-animated-modal";

class CustomerAddress extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        directory: shape({
            countries: array,
            directory_config: object
        }),
        defaultAddress: shape({
            city: string,
            country_id: string,
            email: string,
            firstname: string,
            lastname: string,
            postcode: string,
            region_id: string,
            region_code: string,
            region: string,
            street: array,
            telephone: string
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

    hidePopup = () => {
        this.setState(() => ({
            isPopupAddressFormOpen: false
        }));
    };

    stopEditing = () => {
        console.log('Stop Edit')
    };

    deleteAddress(addressId) {
        const { client, getUserDetails } = this.props;
        alert('Are you sure?');
        this.setState({ isLoading: true });
        client.mutate({
            mutation: deleteCustomerAddress,
            variables: { id: addressId }
        }).then(result => {
            console.log(result);
            getUserDetails();
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            this.setState({ isLoading: false });
        });
    };

    editAddress(address) {
        this.setState({
            currentAddress: address,
            isPopupAddressFormOpen: true
        });
    }

    addNew = () => {
        this.editAddress({});
    }

    get addressFormPopup() {
        const {
            classes,
            submitting,
            isAddressIncorrect,
            incorrectAddressMessage,
            directory,
            addressConfig,
            getUserDetails,
            currentUser
        } = this.props;
        const { addresses } = currentUser;
        const isFirstAddress = !addresses || !addresses.length;
        const { countries, directory_config } = { ...directory };
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
                                directory_config={directory_config}
                                addressConfig={addressConfig}
                                cancel={this.stopEditing}
                                getUserDetails={getUserDetails}
                                isAddressIncorrect={isAddressIncorrect}
                                incorrectAddressMessage={incorrectAddressMessage}
                                hidePopup={this.hidePopup}
                                isFirstAddress={isFirstAddress}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }

    render() {
        const { classes, currentUser } = this.props;
        const { addresses } = currentUser;
        const user = currentUser;
        const defaultBillingAddress = findDefaultAddress(user, 'default_billing');
        const defaultShippingAddress = findDefaultAddress(user, 'default_shipping');

        return (
            <div className={classes.addressPage}>
                <h1>My Addresses</h1>
                <div className={classes.addNewAddressButton}>
                    <Button priority="high" onClick={this.addNew}>
                        Add Address
                    </Button>
                </div>
                {this.state.isLoading ? <div className={classes.loading}>
                    {loadingIndicator}
                </div> : null}
                {this.state.isPopupAddressFormOpen ? this.addressFormPopup : null}
                {addresses && addresses.length ?
                    <Fragment>
                        <div className={classes.defaultAddresses}>
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
                        <div className={classes.otherAddresses}>
                            <h2>Other Addresses</h2>
                            <div className={classes.otherAddressesList}>
                                {user.addresses.map((address, index) => {
                                    return !address.default_billing && !address.default_shipping
                                        ? <div className={classes.addressItem} key={index}>
                                            <AddressRender address={address} />
                                            <div className={classes.boxActions}>
                                                <Button priority="high" onClick={this.editAddress.bind(this, address)}>
                                                    <Icon src={EditIcon} size={14} />
                                                    Edit Address
                                                </Button>
                                                <Button priority="high" index={index} onClick={this.deleteAddress.bind(this, address.id)}>
                                                    <Icon src={DeleteIcon} size={14} />
                                                    Delete Address
                                                </Button>
                                            </div>
                                        </div>
                                        : null
                                })}
                            </div>
                        </div>
                    </Fragment>
                    : <div>
                        <p>You have no addresses.</p>
                    </div>
                }
            </div>
        );
    }
}

export default compose(
    withApollo,
    classify(defaultClasses)
)(CustomerAddress);

