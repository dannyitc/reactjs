import React, { Component, Fragment } from 'react';
import { string, shape } from 'prop-types';
import CompareProduct from '../CompareProduct';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { compose } from 'redux';
import { Query } from 'react-apollo';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import { toast } from "react-toastify";
import classify from 'src/classify';
import defaultClasses from './compare.css';
import compareQuery from 'src/queries/getCompareList.graphql';

const REMOVE_ITEM = gql`
  mutation removeItemCompare($item: Int!) {
    removeItemCompare(item: $item)
  }
`;

class CompareList extends Component {
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

    render() {
        const { classes, isFetching } = this.props;

        return (
            <Query
                query={compareQuery}
            >
                {({ loading, error, data }) => {
                    if (error) return null;
                    if (loading)
                        return loadingIndicator;
                    const compareItems = data.compare_list ? data.compare_list : null;
                    if (!compareItems) return (
                        <div className={classes.empty}>
                            <p>You have no items in your compare.</p>
                        </div>
                    );
                    return (
                        <Fragment>
                            {isFetching && loadingIndicator}
                            {this.state.isLoading ? <div>
                                {loadingIndicator}
                            </div> : null}
                            <CompareProduct
                                data={compareItems}
                                removeItem={this.removeItem}
                            />
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
        }).then(result => {
            console.log(result);
            toast.success('You have removed the item successfully.');
        }).catch((error) => {
            toast.error("Something's wrong.Please try again");
            console.log(error);
        }).finally(() => {
            this.setState({ isLoading: false });
        });
    };
}

export default compose(
    withApollo,
    classify(defaultClasses)
)(CompareList);