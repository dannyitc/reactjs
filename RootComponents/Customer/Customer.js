import React, { Component } from 'react';
import classify from 'src/classify';
import { compose } from 'redux';
import { connect } from 'src/drivers';

import SettingIcon from 'react-feather/dist/icons/settings';
import CustomerIcon from 'react-feather/dist/icons/user';
import orderIcon from 'react-feather/dist/icons/book';
import addressIcon from 'react-feather/dist/icons/map';
import wishlistIcon from 'react-feather/dist/icons/star';
import defaultClasses from './customer.css';
import VerticalTabs from 'src/components/VerticalTabs';
import CustomerDashboard from 'src/components/Account/Dashboard';
import CustomerProfile from 'src/components/Account/Profile';
import CustomerAddress from 'src/components/Account/Address';
import CustomerWishlist from 'src/components/Account/Wishlist';
import CustomerOrder from 'src/components/Account/CustomerOrder';
import { getUserDetails } from 'src/actions/user';
import { getCountries,getDirectoryConfig } from 'src/actions/directory';
import { getAddressConfig } from 'src/actions/checkout';
import Breadcrumbs from 'src/components/Breadcrumbs';

class Customer extends Component {

    async componentDidMount() {
        document.title = 'My Account';
        window.scrollTo(0, 0);
        await this.props.getCountries();
        await this.props.getDirectoryConfig();
        await this.props.getAddressConfig();
        await this.props.getUserDetails();
    }

    render() {
        const { classes, currentUser, getUserDetails, directory, selectedTabIndex, addressConfig } = this.props;

        return (
            <div className={classes.root}>
                <Breadcrumbs />
                <div className={classes.customerPages}>
                    <VerticalTabs
                        extendClass='customerTabClass'
                        currentUser={currentUser}
                        getUserDetails={getUserDetails}
                        directory={directory}
                        addressConfig={addressConfig}
                        selectedTabIndex={selectedTabIndex}
                    >
                        <div label="My Account" icon={SettingIcon}>
                            <CustomerDashboard />
                        </div>
                        <div label="My Profile" icon={CustomerIcon}>
                            <CustomerProfile />
                        </div>
                        <div label="My Orders" icon={orderIcon}>
                            <CustomerOrder />
                        </div>
                        <div label="Addresses" icon={addressIcon}>
                            <CustomerAddress />
                        </div>
                        <div label="Wishlist" icon={wishlistIcon}>
                            <CustomerWishlist />
                        </div>
                    </VerticalTabs>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ user, directory , checkout}) => {
    const { currentUser, selectedTabIndex } = user;
    const { addressConfig } = checkout;
    return {
        currentUser,
        selectedTabIndex,
        directory,
        addressConfig
    };
};

const mapDispatchToProps = {
    getUserDetails,
    getCountries,
    getDirectoryConfig,
    getAddressConfig
};

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Customer);