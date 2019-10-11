import React, { Component, Fragment } from 'react';
import { string, shape } from 'prop-types';
import CompareProduct from '../CompareProduct';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { connect } from 'src/drivers';
import { compose } from 'redux';
import { Query } from 'react-apollo';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import { toast } from "react-toastify";
import classify from 'src/classify';
import defaultClasses from './compare.css';
import globalClasses from 'src/index.css';
import Button from 'src/components/Button';

import { openComparePopup } from 'src/actions/catalog';
import Skeleton from 'react-loading-skeleton';
import compareQuery from 'src/queries/getCompareList.graphql';

const REMOVE_ITEM = gql`
  mutation removeItemCompare($item: Int!) {
    removeItemCompare(item: $item)
  }
`;

const CLEAR_COMPARE = gql`
    mutation clearCompare {
        clearCompare
    }
`;

class CompareSidebar extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            emptyTitle: string,
            continue: string
        })
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            items: []
        };
    }

    showComparePopup = () => {
        const { modalIsOpen } = globalClasses;
        const bodyClasses = document.querySelector('body').classList;
        this.props.openComparePopup(true);
        bodyClasses.add(modalIsOpen);
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    };

    hideComparePopup = () => {
        const { modalIsOpen } = globalClasses;
        const bodyClasses = document.querySelector('body').classList;
        this.props.openComparePopup(false);
        bodyClasses.remove(modalIsOpen)
    };

    clearAll = () => {
        const { client } = this.props;

        this.setState({ isLoading: true });
        client.mutate({
            mutation: CLEAR_COMPARE,
            refetchQueries: [{ query: compareQuery }]
        }).then(result => {
            console.log(result);
            toast.success('You have removed your compare successfully.');
        }).catch((error) => {
            toast.error("Something's wrong.Please try again");
            console.log(error);
        }).finally(() => {
            this.setState({ isLoading: false });
        });
    };

    render() {
        const { classes, isFetching } = this.props;
        const { sidebarBlock, blockTitle, blockContent } = globalClasses;
        return (
            <Query
                query={compareQuery}
            >
                {({ loading, error, data }) => {
                    if (error) return null;
                    if (loading) {
                        return (
                            <div className={sidebarBlock}>
                                <div className={blockTitle}>
                                    <Skeleton />
                                </div>
                                <div className={blockContent}>
                                    <div className={classes.sideBarEmpty}>
                                        <Skeleton />
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    const compareItems = data.compare_list ? data.compare_list : null;
                    if (!compareItems) return (
                        <div className={sidebarBlock}>
                            <div className={blockTitle}>
                                <strong>Compare Product</strong>
                            </div>
                            <div className={blockContent}>
                                <div className={classes.sideBarEmpty}>
                                    <p>You have no items in your compare.</p>
                                </div>
                            </div>
                        </div>
                    );
                    return (
                        <Fragment>
                            {isFetching && loadingIndicator}
                            {this.state.isLoading ? <div>
                                {loadingIndicator}
                            </div> : null}
                            <CompareProduct
                                layout="sidebar"
                                data={compareItems}
                                removeItem={this.removeItem}
                            />
                            <div className={classes.actions}>
                                <Button priority="high" onClick={this.showComparePopup}>
                                    Compare
                                </Button>
                                <Button priority="high" onClick={this.clearAll}>
                                    Clear All
                                </Button>
                            </div>
                        </Fragment>
                    );
                }}
            </Query >
        );
    }

    removeItem = itemId => {
        const { client } = this.props;

        this.setState({ isLoading: true });
        client.mutate({
            mutation: REMOVE_ITEM,
            variables: { item: itemId },
            refetchQueries: [{ query: compareQuery }]
        }).then(() => {
            toast.success('You have removed the item successfully.');
        }).catch((error) => {
            toast.error("Something's wrong.Please try again");
            console.log(error);
        }).finally(() => {
            this.setState({ isLoading: false });
        });
    };
}
const mapDispatchToProps = {
    openComparePopup
};

export default compose(
    withApollo,
    classify(defaultClasses),
    connect(
        null,
        mapDispatchToProps
    )
)(CompareSidebar);