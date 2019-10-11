import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { shape, string } from 'prop-types';

import defaultClasses from './tabs.css';
import classify from 'src/classify';

import Tab from 'src/components/Tab';

class Tabs extends Component {
    static propTypes = {
        classes: shape({
            tabRoot: string,
            tabList: string,
            tabContent: string
        }),
        children: PropTypes.instanceOf(Array).isRequired
    };

    constructor(props) {
        super(props);

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
        this.setState({ selectedIndex: index });
    };

    render() {
        const {
            onClickTabItem,
            props: { children },
            state: { selectedIndex }
        } = this;

        const { classes } = this.props;

        return (
            <div className={classes.tabRoot}>
                <div className={classes.tabList}>
                    {children.map((child,index) => {
                        if (!child) return null;
                        const { label } = child.props;
                        const hideTabStyle = {
                            display: 'none'
                        };
                        const showTabStyle = {
                            display: 'block'
                        };
                        const styles = index !== selectedIndex ? hideTabStyle : showTabStyle;
                        return (
                            <Fragment key={label}>
                                <Tab
                                    selectedIndex={selectedIndex}
                                    tabIndex={index}
                                    label={label}
                                    onClick={onClickTabItem}
                                />
                                <div className={classes.tabContent} style={styles}>
                                    {child.props.children}
                                </div>
                            </Fragment>
                        );
                    })}
                
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(Tabs);
