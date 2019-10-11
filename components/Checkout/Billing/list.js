import React, { Component } from 'react';
import memoize from 'memoize-one';
import { bool, shape, string, array } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './form.css';
import Select from 'src/components/Select';

const fields = [
    'firstname',
    'lastname',
    'street',
    'city',
    'region',
    'country_id',
    'postcode'
];

const filterInitialValues = memoize(values =>
    fields.reduce((acc, key) => {
        if (key == 'street' && Array.isArray(values[key])) {
            acc[key] = values[key][0]
        } else if (key == 'region' && typeof values[key] === 'object') {
            acc[key] = values[key].region;
        } else {
            acc[key] = values[key];
        }
        return acc;
    }, {})
);

class BillingList extends Component {
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
            selectedAddressId: null,
            region: null
        };
    }

    static defaultProps = {
        initialValues: {}
    };

    static getDerivedStateFromProps(props, state) {
        const { tempBillData, addresses } = props;
        const { selectedAddressId } = state;
        let addressId;
        if (selectedAddressId == null) {
            addressId = tempBillData.address_id ? tempBillData.address_id : (addresses ? addresses[0].id : 0);
        } else {
            addressId = selectedAddressId;
        }
        return {
            ...state,
            selectedAddressId: addressId
        };
    }

    render() {
        const { props } = this;
        const { classes, addresses } = props;

        const addressOptions = addresses ? addresses.map(address => Object.assign({},
            {
                value: address.id,
                label: Object.values(filterInitialValues(address)).join(',')
            }
        )) : [];
        addressOptions.push({
            value: 0,
            label: 'New Address'
        });

        return (
            <Select
                id={classes.address_id}
                field="address_id"
                items={addressOptions}
                onChange={this.changeAddress}
                fieldState={{ value: this.state.selectedAddressId }}
            />
        );
    }

    changeAddress = (event) => {
        const value = event.target.value;
        this.setState({ selectedAddressId: value });
        this.props.changeAddress(value);
    };
}

export default classify(defaultClasses)(BillingList);