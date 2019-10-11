import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { shape, string } from 'prop-types';

import defaultClasses from './verticaltabs.css';
import classify from 'src/classify';

import VerticalTab from 'src/components/VerticalTab';
import WishlistSidebar from 'src/components/Account/Wishlist/sidebar';
import CompareSidebar from 'src/components/CompareList/sidebar';
class VerticalTabs extends Component {
    static propTypes = {
        classes: shape({
            tabRoot: string,
            tabList: string,
            tabContent: string
        }),
        extendClass: string,
        children: PropTypes.instanceOf(Array).isRequired
    };

    constructor() {
        super();

        this.state = {
            isChangeTab: false,
            selectedIndex: 0
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { selectedTabIndex } = props;

        let newTabIndex = null;
        if (selectedTabIndex != null && !state.isChangeTab) {
            newTabIndex = selectedTabIndex;
        } else {
            newTabIndex = state.selectedIndex;
        }

        
        return {
            ...state,
            isChangeTab: false,
            selectedIndex: newTabIndex
        };
    }

    onClickTabItem = index => {
        this.setState({ isChangeTab: true });
        this.changeTabIndex(index);
    };

    changeTabIndex = index => {
        this.setState({ selectedIndex: index });
    }

    render() {
        const {
            onClickTabItem,
            props: { children, extendClass, currentUser, getUserDetails, directory, addressConfig },
            state: { selectedIndex }
        } = this;

        const { classes } = this.props;

        const tabRootClass = extendClass != '' ? classes[extendClass] : classes.tabRoot;

        return (
            <div className={tabRootClass}>
                <div className={classes.tabList}>
                    <div className={classes.tabHead}>
                        {children.map((child, index) => {
                            const { label, icon } = child.props;
                            return (
                                <VerticalTab
                                    selectedIndex={selectedIndex}
                                    tabIndex={index}
                                    label={label}
                                    key={index}
                                    icon={icon}
                                    onClick={onClickTabItem}
                                />
                            );
                        })}
                        {/* <WishlistSidebar />
                        <CompareSidebar /> */}
                    </div>
                    <div className={classes.tabContent}>
                        {children.map((child, index) => {
                            if (index !== selectedIndex) return undefined;
                            const cloned = React.cloneElement(child.props.children, {
                                onChangeTab: this.changeTabIndex,
                                getUserDetails: getUserDetails,
                                directory: directory,
                                key: index,
                                addressConfig: addressConfig,
                                currentUser: currentUser
                            })
                            return cloned;
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(VerticalTabs);
