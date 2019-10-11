import React, { Component, Fragment } from 'react';
import { bool, func, shape, string, array } from 'prop-types';
import orderBy from 'lodash/orderBy';

import classify from 'src/classify';
import defaultClasses from './form.css';
import {
    isRequired
} from 'src/util/formValidators';
import TextInput from 'src/components/TextInput';
import Select from 'src/components/Select';
import Field from 'src/components/Field';
import Checkbox from 'src/components/Checkbox';

class BillingForm extends Component {
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
            regionOptions: [],
            selectedCountryId: null,
            region: null
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

    render() {
        const { classes, countries, isSignedIn } = this.props;

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

        return (
            <div className={classes.addressContent}>
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
                        <TextInput
                            className={classes.textInput}
                            id={classes.street0}
                            field="street"
                            validate={isRequired}
                        />
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
                        />
                    </Field>
                </div>
                <div className={classes.region}>
                    <Field required={true} className={classes.addressField} label="State">
                        {
                            this.state.regionOptions && this.state.regionOptions.length
                                ?
                                <Select
                                    id={classes.region_id}
                                    field="region_id"
                                    items={this.state.regionOptions}
                                    validate={isRequired}
                                />
                                : <TextInput
                                    className={classes.textInput}
                                    id={classes.region}
                                    field="region"
                                    value={this.state.region}
                                    validate={isRequired}
                                />
                        }
                    </Field>
                </div>
                <div className={classes.telephone}>
                    <Field required={true} className={classes.addressField} label="Phone">
                        <TextInput
                            className={classes.textInput}
                            id={classes.telephone}
                            field="telephone"
                            validate={isRequired}
                        />
                    </Field>
                </div>
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
        );
    }

    changeCountry = (e) => {
        const { countries } = this.props;

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
        this.setState({
            regionOptions: regionOptions,
            selectedCountryId: selectedCountryId
        });
    }

    cancel = () => {
        this.props.cancel();
    };

}

export default classify(defaultClasses)(BillingForm);