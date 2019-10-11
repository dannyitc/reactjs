import React, { Component, Fragment } from 'react';
import { Form } from 'informed';
import memoize from 'memoize-one';
import { bool, func, shape, string, array } from 'prop-types';
import orderBy from 'lodash/orderBy';

import classify from 'src/classify';
import Button from 'src/components/Button';
import defaultClasses from './addressForm.css';
import {
    validateEmail,
    isRequired,
    validateRegion
} from 'src/util/formValidators';
import combine from 'src/util/combineValidators';
import TextInput from 'src/components/TextInput';
import Select from 'src/components/Select';
import Field from 'src/components/Field';
import Checkbox from 'src/components/Checkbox';

const fields = [
    'city',
    'email',
    'firstname',
    'lastname',
    'postcode',
    'region_code',
    'region',
    'region_id',
    'street',
    'telephone',
    'country_id'
];

const filterInitialValues = memoize(values =>
    fields.reduce((acc, key) => {
        acc[key] = values[key];
        return acc;
    }, {})
);

class AddressForm extends Component {
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
        submit: func.isRequired,
        submitting: bool,
        directoryConfig: array,
        countries: array,
        inline: bool
    };

    constructor(props) {
        super(props);
        this.state = {
            regionRequire: false,
            allow_choose_state: false,
            hide_region: false,
            regionOptions: [],
            selectedCountryId: null,
            region: null
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { countries, initialValues, directory_config } = props;

        if (!countries || !initialValues) {
            return state;
        }
        const countryId = state.selectedCountryId ? state.selectedCountryId : initialValues.country_id;
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
                regionRequire: regionRequire,
                hide_region: hide_region,
                allow_choose_state : allow_choose_state
            };
        }
        const country = countries.find(({ id }) => id === countryId);
        const { available_regions: regions } = country;
        let regionOptions = regions ? regions.map(region => Object.assign({},
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
        const region = regions && initialValues.region_id ? regions.find(({ id }) => id === initialValues.region_id) : null;

        return {
            ...state,
            regionRequire: regionRequire,
            hide_region: hide_region,
            allow_choose_state : allow_choose_state,
            regionOptions: regionOptions,
            region: region,
            selectedCountryId: countryId
        };
    }

    static defaultProps = {
        initialValues: {}
    };

    validationBlock = () => {
        const { isAddressIncorrect, incorrectAddressMessage } = this.props;
        if (isAddressIncorrect) {
            return incorrectAddressMessage;
        } else {
            return null;
        }
    };

    // componentDidUpdate() {
    //     const { countries,directory_config } = this.props;

    //     let selected = this.state.selectedCountryId;
    //     let regionOptions = this.state.regionOptions;
    //     if(!selected){
    //         selected = directory_config?directory_config.default_country:'';
    //         if(countries && selected){
    //             const country = countries.find(({ id }) => id === selected);
    //             const { available_regions: regions } = country;
    //             regionOptions = regions ? regions.map(region => Object.assign({},
    //                 {
    //                     value: region.id,
    //                     label: region.name
    //                 }))
    //                 : [];
    //             if (regions) {
    //                 regionOptions.unshift({
    //                     value: '',
    //                     label: 'Please select a region/state'
    //                 });
    //             }
    //             this.setState({
    //                 regionOptions: regionOptions,
    //                 selectedCountryId: selected
    //             });
    //         }
            
    //     }
    // }

    render() {
        const { children, props } = this;
        const { classes, initialValues } = props;
        let values = initialValues ? filterInitialValues(initialValues) : {};
        values['saveInAddressBook'] = true;

        return (
            <Form
                className={classes.root}
                initialValues={values}
                onSubmit={this.submit}
            >
                {children}
            </Form>
        );
    }

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
            regionOptions: regionOptions,
            selectedCountryId: selectedCountryId
        });
    }

    children = () => {
        const { classes, submitting, countries,directory_config, initialValues, inline, isSignedIn, addressConfig } = this.props;

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
        const submitTitle = inline ? 'Next' : 'Save';

        const addressContentClass = inline ? classes.addressContent : classes.addressContentPopup;

        // let selected = this.state.selectedCountryId;
        // let regionOptions = this.state.regionOptions;
        // let region = this.state.region;
        // if(!selected){
        //     selected = directory_config?directory_config.default_country:'';
        //     if(countries && selected){
        //         const country = countries.find(({ id }) => id === selected);
        //         const { available_regions: regions } = country;
        //         regionOptions = regions ? regions.map(region => Object.assign({},
        //             {
        //                 value: region.id,
        //                 label: region.name
        //             }))
        //             : [];
        //         if (regions) {
        //             regionOptions.unshift({
        //                 value: '',
        //                 label: 'Please select a region/state'
        //             });
        //         }
        //         region = regions && initialValues.region_id ? regions.find(({ id }) => id === initialValues.region_id) : null;
        //     }
        //     this.setState({
        //         regionOptions: regionOptions,
        //         selectedCountryId: selected
        //     });
            
        // }


        return (
            <Fragment>
                <div className={classes.body}>
                    <h2 className={classes.heading}>Shipping Address</h2>
                    <div className={addressContentClass}>
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
                        <div className={classes.street0}>
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
                        <div className={classes.country}>
                            <Field required={true} className={classes.addressField} label="Country">
                                <Select
                                    id={classes.country_id}
                                    field="country_id"
                                    items={countryOptions}
                                    onChange={this.changeCountry}
                                    validate={isRequired}
                                    fieldState={{ value: this.state.selectedCountryId}}
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
                                                field="region_id"
                                                items={this.state.regionOptions}
                                                validate={this.state.regionRequire?validateRegion:''}
                                            />
                                            : <TextInput
                                                className={classes.textInput}
                                                id={classes.region}
                                                field="region"
                                                value={this.state.region}
                                                validate={this.state.regionRequire?isRequired:''}
                                            />
                                    }
                                </Field>
                            </div>
                        }
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
                        {!isSignedIn &&
                            <div className={classes.email}>
                                <Field required={true} className={classes.addressField} label="Email">
                                    <TextInput
                                        className={classes.textInput}
                                        id={classes.email}
                                        field="email"
                                        validate={combine([isRequired, validateEmail])}
                                    />
                                </Field>
                            </div>
                        }
                        {isSignedIn &&
                            <Checkbox
                                field="saveInAddressBook"
                                label="Save In Address Book"
                            />
                        }
                        <div className={classes.validation}>
                            {this.validationBlock()}
                        </div>
                    </div>
                </div >
                <div className={classes.footer}>
                    <Button
                        className={classes.button}
                        type="submit"
                        priority="high"
                        disabled={submitting}
                    >
                        {submitTitle}
                    </Button>
                </div>
            </Fragment >
        );
    };

    cancel = () => {
        this.props.cancel();
    };

    submit = values => {
        this.props.submit(values);
    };
}

export default classify(defaultClasses)(AddressForm);