import React, { Component } from 'react';
import { Form } from 'informed';
import memoize from 'memoize-one';
import { bool, func, shape, string, array } from 'prop-types';

import classify from 'src/classify';
import Button from 'src/components/Button';
import { compose } from 'redux';
import orderBy from 'lodash/orderBy';

import { isRequired, validateRegion } from 'src/util/formValidators';
import TextInput from 'src/components/TextInput';
import Select from 'src/components/Select';
import Field from 'src/components/Field';
import Checkbox from 'src/components/Checkbox';
import { updateCustomerAddress } from 'src/mutations/updateCustomerAddress';
import { createCustomerAddress } from 'src/mutations/createCustomerAddress';
import { withApollo } from 'react-apollo';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import defaultClasses from './addressForm.css';
import { toast } from "react-toastify";

const fields = [
    'city',
    'firstname',
    'lastname',
    'postcode',
    'street',
    'company',
    'region',
    'telephone',
    'default_billing',
    'default_shipping',
    'country_id'
];

const filterInitialValues = memoize(values =>
    fields.reduce((acc, key) => {
        acc[key] = values[key] ? values[key] : '';
        return acc;
    }, {})
);

class AddressForm extends Component {
    static propTypes = {
        cancel: func,
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
        submit: func,
        submitting: bool,
        countries: array
    };

    constructor() {
        super();
        this.state = {
            streetLines: 1,
            showTelephone: 'req',
            showCompany:'opt',
            isLoading: false,
            regionOptions: [],
            region: null
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { countries, address, directory_config,addressConfig } = props;

        if (!countries) {
            return state;
        }
        const countryId = state.selectedCountryId ? state.selectedCountryId : address.country_id;

        let streetLines = 1;
        let showCompany = 'req';
        let showTelephone = 'opt';
        if(addressConfig){
            streetLines = addressConfig.street_lines;
            showCompany = addressConfig.show_company;
            showTelephone = addressConfig.show_telephone;
        }
        let allow_choose_state = false;
        let hide_region = false;
        let regionRequire = false;
        if(directory_config && directory_config.allow_choose_state == '1'){
            allow_choose_state =  true ;
        }
        let selected = countryId;

        if(!countryId){
            selected = directory_config?directory_config.default_country:null
        }

        if(selected && directory_config && directory_config.state_require_for){
            if(directory_config.state_require_for.indexOf(selected) != '-1'){
                regionRequire = true;
            }
        }

        if(!allow_choose_state){
            if(selected && directory_config && directory_config.state_require_for){
                if(directory_config.state_require_for.indexOf(selected) == '-1'){
                    hide_region = true;
                }
            }
        }

        if (!countryId) {
            return {
                ...state,
                streetLines: streetLines,
                showCompany: showCompany,
                showTelephone: showTelephone,
                regionRequire: regionRequire,
                hide_region: hide_region,
                allow_choose_state : allow_choose_state
            };
        }
        const country = countries.find(({ id }) => id === countryId);
        const { available_regions: regions } = country;
        const regionOptions = regions ? regions.map(region => Object.assign({},
            {
                value: region.id,
                label: region.name
            }))
            : [];
        const region = regions && address.region_id ? regions.find(({ id }) => id === address.region_id) : null;
        if (regions) {
            regionOptions.unshift({
                value: '',
                label: 'Please select a region/state'
            });
        }

        return {
            ...state,
            streetLines: streetLines,
            showCompany: showCompany,
            showTelephone: showTelephone,
            regionRequire: regionRequire,
            hide_region: hide_region,
            allow_choose_state : allow_choose_state,
            regionOptions: regionOptions,
            region: region,
            selectedCountryId: countryId
        };
    }

    validationBlock = () => {
        const { isAddressIncorrect, incorrectAddressMessage } = this.props;
        if (isAddressIncorrect) {
            return incorrectAddressMessage;
        } else {
            return null;
        }
    };

    changeCountry = (e) => {
        const { countries, directory_config } = this.props;

        const selectedCountryId = e.currentTarget.value;
        const country = countries.find(({ id }) => id === selectedCountryId);
        const { available_regions: regions } = country;
        const regionOptions = regions ? regions.map(region => Object.assign({},
            {
                value: region.id,
                label: region.name
            }))
            : [];
        if (regions) {
            regionOptions.unshift({
                value: '',
                label: 'Please select a region/state'
            });
        }

        let allow_choose_state = false;
        let hide_region = false;
        let regionRequire = false;
        if(directory_config && directory_config.allow_choose_state == '1'){
            allow_choose_state =  true ;
        }
    

        if(selectedCountryId && directory_config && directory_config.state_require_for){
            if(directory_config.state_require_for.indexOf(selectedCountryId) != '-1'){
                regionRequire = true;
            }
        }

        if(!allow_choose_state){
            if(selectedCountryId && directory_config && directory_config.state_require_for){
                if(directory_config.state_require_for.indexOf(selectedCountryId) == '-1'){
                    hide_region = true;
                }
            }
        }

        this.setState({
            regionRequire: regionRequire,
            hide_region: hide_region,
            allow_choose_state : allow_choose_state,
            selectedCountryId: selectedCountryId,
            regionOptions: regionOptions
        });
    }

    render() {
        const { classes, address, submitting, countries, isFirstAddress, directory_config, addressConfig } = this.props;

        let streetLines = [];
        if(addressConfig && addressConfig.street_lines > 1){
            for(let i = 0;i<addressConfig.street_lines;i++){
                streetLines.push(i);
            }
        }

        let showCompany = true;
        if(addressConfig){
            if(addressConfig.show_company){
                showCompany = addressConfig.show_company;
            }
            else{
                showCompany = false;
            }
        }
        let showTelephone = true;
        if(addressConfig){
            if(addressConfig.show_telephone){
                showTelephone = addressConfig.show_telephone;
            }
            else{
                showTelephone = false;
            }
        }

        const values = address ? filterInitialValues(address) : {};
        values.default_billing = values.default_billing ? values.default_billing : (isFirstAddress ? true : false);
        values.default_shipping = values.default_shipping ? values.default_shipping : (isFirstAddress ? true : false);
        const countryArray = countries ? countries.map(country => Object.assign({},
            {
                value: country.id,
                label: country.full_name_locale
            }
        )) : null;
        const countryOptions = countryArray ? orderBy(countryArray, ['label'], ['asc']) : [];
        if (countryOptions) {
            countryOptions.unshift({
                value: '',
                label: 'Please select a country'
            });
        }
        let selected = this.state.selectedCountryId;

        if(!selected){
            selected = directory_config?directory_config.default_country:'';
        }
        const title = address.id ? 'Edit Address' : 'Add New Address';
        return (
            <Form
                className={classes.root}
                initialValues={values}
                onSubmit={this.submit}
            >
                {this.state.isLoading &&
                    <div className={classes.loading}>
                        {loadingIndicator}
                    </div>
                }
                <div className={classes.body}>
                    <h2 className={classes.heading}>{title}</h2>
                    <div className={classes.addressContent}>
                        <div className={classes.addressContactInfo}>
                            <strong className={classes.boxTitle}>
                                <span>Contact Information</span>
                            </strong>
                            <div className={classes.firstname}>
                                <Field required={true} className={classes.addressField} label="First Name">
                                    <TextInput
                                        className={classes.textInput}
                                        id={classes.firstname}
                                        field="firstname"
                                        validate={isRequired}
                                    />
                                </Field>
                            </div>
                            <div className={classes.lastname}>
                                <Field required={true} className={classes.addressField} label="Last Name">
                                    <TextInput
                                        className={classes.textInput}
                                        id={classes.lastname}
                                        field="lastname"
                                        validate={isRequired}
                                    />
                                </Field>
                            </div>
                            {showCompany?
                                <div className={classes.company}>
                                    <Field className={classes.addressField} label="Company">
                                        <TextInput
                                            className={classes.textInput}
                                            id={classes.company}
                                            field="company"
                                            validate={showCompany=='req'?isRequired:''}
                                        />
                                    </Field>
                                </div>:''
                            }
                            {showTelephone?
                                <div className={classes.telephone}>
                                    <Field required={showTelephone == 'req'?true:false} className={classes.addressField} label="Phone">
                                        <TextInput
                                            className={classes.textInput}
                                            id={classes.telephone}
                                            field="telephone"
                                            validate={showTelephone=='req'?isRequired:''}
                                        />
                                    </Field>
                                </div>:''
                            }
                            
                        </div>
                        <div className={classes.addressDetails}>
                            <strong className={classes.boxTitle}>
                                <span>Address</span>
                            </strong>
                            <div className={classes.city}>
                                <Field required={true} className={classes.addressField} label="City">
                                    <TextInput
                                        className={classes.textInput}
                                        id={classes.city}
                                        field="city"
                                        validate={isRequired}
                                    />
                                </Field>
                            </div>
                            <div className={classes.country}>
                                <Field required={true} className={classes.addressField} label="Country">
                                    <Select
                                        id={classes.country_id}
                                        field="country_id"
                                        items={countryOptions}
                                        onChange={this.changeCountry}
                                        validate={isRequired}
                                        fieldState={{ value: selected}}
                                    />
                                </Field>
                            </div>
                            {this.state.hide_region?'':
                            <div className={classes.region}>
                                <Field required={this.state.regionRequire?true:false} className={classes.addressField} label="State">
                                    {
                                        this.state.regionOptions && this.state.regionOptions.length
                                            ?
                                            <Select
                                                id={classes.region_id}
                                                field="region.region_id"
                                                items={this.state.regionOptions}
                                                onChange={this.changeRegion}
                                                validate={this.state.regionRequire?validateRegion:''}
                                            />
                                            : <TextInput
                                                className={classes.textInput}
                                                id={classes.region}
                                                field="region.region"
                                                value={this.state.region ? this.state.region.region : ''}
                                                validate={this.state.regionRequire?isRequired:''}
                                            />
                                    }
                                </Field>
                            </div>
                            }
                            <div className={classes.postcode}>
                                <Field required={true} className={classes.addressField} label="ZIP">
                                    <TextInput
                                        className={classes.textInput}
                                        id={classes.postcode}
                                        field="postcode"
                                        validate={isRequired}
                                    />
                                </Field>
                            </div>
                            <Field required={true} className={classes.addressField} label="Street">
                            {
                            streetLines.map((val, idx) => {
                                let streetId = `street[${idx}]`;
                                let classname = `street${idx}`;
                                return (
                                    <div className={classes.street0}>
                                            <TextInput
                                                className={classes.textInput}
                                                id={classname}
                                                field={streetId}
                                                validate={idx == '0'?isRequired:''}
                                            />
                                    </div>
                                )
                            })
                            }
                            </Field>
                        </div>
                        <div className={classes.validation}>
                            {this.validationBlock()}
                        </div>
                        <div className={classes.address_check}>
                            {!address.default_billing
                                ? <Checkbox
                                    field="default_billing"
                                    label="Set as Default Billing Address"
                                    disabled={isFirstAddress}
                                />
                                : null
                            }
                            {!address.default_shipping
                                ? <Checkbox
                                    field="default_shipping"
                                    label="Set as Default Shipping Address"
                                    disabled={isFirstAddress}
                                />
                                : null
                            }
                        </div>
                    </div>
                </div>
                <div className={classes.footer}>
                    <Button
                        className={classes.button}
                        type="submit"
                        priority="high"
                        disabled={submitting}
                    >
                        Save
                    </Button>
                </div>
            </Form>
        );
    }

    cancel = () => {
        this.props.cancel();
    };

    submit = values => {
        const { address, getUserDetails, client, hidePopup } = this.props;
        const payload = {
            input: values
        }
        if (address.id) payload.id = address.id;

        const mutation = payload.id ? updateCustomerAddress : createCustomerAddress;
        this.setState({ isLoading: true });
        client.mutate({
            mutation: mutation,
            variables: payload
        }).then(() => {
            toast.success('You have updated the address successfully.');
            getUserDetails();
        }).catch((error) => {
            toast.error("Something's wrong.Please try again");
            console.log(error);
        }).finally(() => {
            this.setState({
                isLoading: false
            }, () => {
                hidePopup();
            });
        });
    };
}

export default compose(
    withApollo,
    classify(defaultClasses)
)(AddressForm);