import React, { Component, Fragment } from 'react';
import { shape, string, array } from 'prop-types';

import classify from 'src/classify';
import Button from 'src/components/Button';
import defaultClasses from './addressList.css';
import AddressRender from '../AddressRender';
import AddressForm from '../addressForm';
import Modal from "react-animated-modal";

import {
    validateEmail,
    isRequired,
    hasLengthExactly,
    validateRegionCode
} from 'src/util/formValidators';

class AddressList extends Component {
    static propTypes = {
        classes: shape({
            body: string,
            button: string,
            city: string,
            email: string,
            firstname: string,
            footer: string,
            lastname: string,
            postcode: string,
            region_code: string,
            street0: string,
            telephone: string,
            textInput: string,
            validation: string
        })
    };

    constructor(props) {
        super(props);
        this.state = {
            openPopup: false,
            newAddress: {},
            addresses: [],
            hasNewAddress: false,
            selectedAddress: null,
            selectDefault: false
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { user, newAddress, shippingAddress } = props;
        const { addresses } = user.currentUser;
        const defaultShipping = addresses.find(
            (address) => address.default_shipping
        );
        let newList = addresses;
        if (newAddress) {
            newList = addresses.concat(newAddress);
        }
        let selectedAddress = null;
        if (state.selectedAddress) {
            selectedAddress = state.selectedAddress;
        } else if (shippingAddress) {
            selectedAddress = shippingAddress;
        } else {
            selectedAddress = defaultShipping;
        }
        return {
            ...state,
            addresses: newList,
            selectedAddress: selectedAddress,
            newAddress: newAddress,
            hasNewAddress: newAddress ? true : false
        };
    }

    static defaultProps = {
        initialValues: {}
    };

    selectAddress = (address) => {
        this.setState({ selectedAddress: address });
    }

    openPopup = () => {
        this.setState({
            openPopup: true
        });
    }

    editNewAddress = () => {
        this.setState({
            openPopup: true
        });
    }

    hidePopup = () => {
        this.setState(() => ({
            openPopup: false
        }));
    };

    submit = (formValues) => {
        this.props.submitNewAddress({
            type: 'shippingAddress',
            formValues
        });
        this.setState({
            selectedAddress: formValues,
            openPopup: false,
            hasNewAddress: true,
        });
    }

    get addressFormPopup() {
        const {
            classes,
            directory,
            getShippingMethods,
            isSignedIn,
            addressConfig,
        } = this.props;
        const { countries, directory_config } = directory;
        const { newAddress, openPopup } = this.state;

        return (
            <Modal visible={openPopup} closemodal={this.hidePopup} type="slideInUp">
                <div className={classes.popupAddress}>
                    <div className={classes.popupWrapper}>
                        <div className={classes.popupContent}>
                            <AddressForm
                                address={newAddress}
                                initialValues={newAddress}
                                countries={countries}
                                directory_config={directory_config}
                                addressConfig={addressConfig}
                                inline={false}
                                submit={this.submit}
                                getShippingMethods={getShippingMethods}
                                isSignedIn={isSignedIn}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }

    render() {
        const { classes } = this.props;
        const { selectedAddress } = this.state;
        const selectedId = selectedAddress ? selectedAddress.id : null;

        return (
            <div className={classes.otherAddresses}>
                {this.state.openPopup ? this.addressFormPopup : null}
                <div className={classes.otherAddressesList}>
                    {this.state.addresses.map((address, index) => {
                        return (
                            <div className={selectedId == address.id ? classes.activeItem : classes.addressItem} key={index}>
                                <AddressRender address={address} />
                                {selectedId != address.id &&
                                    <Button name="select-address" priority="high" onClick={this.selectAddress.bind(this, address)}>
                                        Ship here
                                    </Button>
                                }
                                {!address.id &&
                                    <Button name="edit-address" priority="high" onClick={this.editNewAddress.bind(this, address)}>
                                        Edit
                                    </Button>
                                }
                            </div>
                        );

                    })}
                </div>
                {!this.state.hasNewAddress &&
                    <Button onClick={this.openPopup}
                        className={classes.button}
                        priority="high"
                        name="new-address"
                    >
                        + New Address
                    </Button>
                }
                {this.state.selectedAddress &&
                    <div className={classes.footer}>
                        <Button onClick={this.nextStep}
                            className={classes.button}
                            priority="high"
                        >
                            Next
                    </Button>
                    </div>
                }
            </div>
        );
    }

    nextStep = () => {
        this.props.submitShippingAddress(this.state.selectedAddress);
    }

}

export default classify(defaultClasses)(AddressList);