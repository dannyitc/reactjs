import React, { Component, Fragment } from 'react';
import { bool, shape, string, array } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './billing.css';
import Checkbox from 'src/components/Checkbox';
import AddressRender from '../AddressRender';
import BillingForm from './form';
import BillingList from './list';
import Button from 'src/components/Button';
import { Form } from 'informed';

class Billing extends Component {
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
        }),
        incorrectAddressMessage: string,
        submitting: bool,
        countries: array,
        inline: bool
    };

    constructor(props) {
        super(props);
        this.state = {
            billingData: null,
            tempBillData: {},
            showForm: false,
            selectedAddress: null,
            same: true
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { addresses, shippingAddress } = props;
        const { selectedAddress, same, billingData } = state;
        const currentAddress = selectedAddress ? selectedAddress : addresses[0];
        if (addresses && addresses.length) {
            return {
                ...state,
                billingData: same ? shippingAddress : billingData,
                selectedAddress: currentAddress
            }
        }
        return {
            ...state,
            showForm: true,
            billingData: same ? shippingAddress : billingData,
            selectedAddress: currentAddress
        }
    }

    render() {
        const { classes } = this.props;
        const { tempBillData } = this.state;

        return (
            <Form
                className={classes.formBilling}
                onSubmit={this.submit}
                initialValues={tempBillData}
            >
                <div className={classes.address_check}>
                    <Checkbox
                        field="same_shipping"
                        label="Billing address same as shipping address"
                        onClick={this.onChangeSameShipping}
                        fieldState={{ value: this.state.same }}
                    />
                    {this.state.billingData
                        ? <div className={classes.billingAddressData}>
                            <AddressRender address={this.state.billingData} />
                        </div>
                        : this.billingAddress
                    }
                    {this.state.billingData && !this.state.same &&
                        < Button
                            priority="high"
                            onClick={this.edit}
                        > Edit
                        </Button>
                    }
                </div>
            </Form >
        );
    }

    get billingAddress() {
        const { isSignedIn, addresses, countries, classes } = this.props;
        const { tempBillData } = this.state;
        return (
            <Fragment>
                <div className={classes.paymentMethodBilling}>
                    {isSignedIn &&
                        <div className={classes.fieldSelectBilling}>
                            <BillingList
                                addresses={addresses}
                                changeAddress={this.changeAddress}
                                tempBillData={tempBillData}
                            />
                        </div>
                    }
                    {
                        this.state.showForm &&
                        <BillingForm
                            countries={countries}
                            isSignedIn={isSignedIn}
                        />
                    }
                    <div className={classes.actions}>
                        <Button
                            name="cancel-edit-billing"
                            priority="high"
                            onClick={this.cancel}
                        > Cancel
                        </Button>
                        <Button
                            type="submit"
                            priority="high"
                        > Update
                        </Button>
                    </div>
                </div>
            </Fragment>
        );
    }

    onChangeSameShipping = () => {
        const { same } = this.state;
        const { shippingAddress, onChangeSameShipping } = this.props;
        const billingData = same ? null : shippingAddress;
        this.setState({
            same: !same,
            showForm: false,
            billingData: billingData
        });
        onChangeSameShipping({
            same: !same,
            billingData: billingData
        });
    }

    changeBillingData = (data) => {
        this.setState({ billingData: data })
    }

    cancel = () => {
        this.setState({ same: true });
        this.props.changeBillingData(null);
    }

    changeAddress = (addressId) => {
        const { addresses } = this.props;
        const address = addresses.find(({ id }) => id == addressId);

        const isNew = addressId === '0';
        this.setState({
            showForm: isNew,
            selectedAddress: isNew ? addresses[0] : address,
            tempBillData: {}
        });
    }

    submit = values => {
        const { changeBillingData } = this.props;
        const { showForm } = this.state;
        const billingData = showForm ? Object.assign({}, values, true) : this.state.selectedAddress;
        this.setState({
            billingData: billingData,
            tempBillData: {}
        });
        changeBillingData(billingData);
    };

    edit = () => {
        const { billingData } = this.state;
        let tempBillData = Object.assign({}, billingData, true);
        tempBillData.address_id = billingData.id ? billingData.id : '0';
        delete tempBillData.id;
        this.setState({
            billingData: null,
            tempBillData: tempBillData
        });
    }
}

export default classify(defaultClasses)(Billing);