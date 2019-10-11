import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './sidebar.css';
import globalClasses from 'src/index.css';
import { Form } from 'informed';
import WishlistProduct from '../WishlistProduct';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { compose } from 'redux';
import { Query } from 'react-apollo';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import { toast } from "react-toastify";
import { connect } from 'src/drivers';
import { goToWishListPage, updateWishlist } from 'src/actions/user';
import { getCartDetails } from 'src/actions/cart';
import { createLoadingSelector } from 'src/selectors/loading';
import Button from 'src/components/Button';
import { withRouter } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

const customerWishlistQuery = gql`
    query customer {
        customer {
            id
            wishlist {
                id
                small_image
                url_key
                name
                qty
                product_id
                price
                currency
                special_price
                final_price
                type_id
                description
                is_available
            }
        }
    }
`;

const ADD_TO_CART = gql`
  mutation addToCartFromWishlist($item: Int!,$qty: Int!) {
    addToCartFromWishlist(item: $item,qty: $qty)
  }
`;

const REMOVE_ITEM = gql`
  mutation removeItemWishlist($item: Int!) {
    removeItemWishlist(item: $item)
  }
`;

class WishlistSidebar extends Component {
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

    goToWishListPage = () => {
        const { history, goToWishListPage } = this.props;
        goToWishListPage(history);
    }

    render() {
        const { classes, isSignedIn, isFetching } = this.props;
        const { sidebarBlock, blockTitle, blockContent } = globalClasses;

        if (!isSignedIn) {
            return null;
        }

        return (
            <Query
                query={customerWishlistQuery}
                fetchPolicy={"cache-and-network"}
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
                                    <div className={classes.blockEmpty}><Skeleton /></div>
                                </div>
                            </div>
                        );
                    }
                    const wishlistItems = data.customer ? data.customer.wishlist : null;
                    if (!wishlistItems) return (
                        <div className={sidebarBlock}>
                            <div className={blockTitle}>
                                <strong>My Wish List</strong>
                            </div>
                            <div className={blockContent}>
                                <div className={classes.blockEmpty}>You have no items in your wish list.</div>
                            </div>
                        </div>
                    );
                    return (
                        <Form
                            className={classes.formWishlistItems}
                            onChange={this.onChange}
                        >
                            {isFetching && loadingIndicator}
                            <div className={sidebarBlock}>
                                <div className={blockTitle}>
                                    <strong>My Wish List</strong>
                                </div>
                                <div className={blockContent}>
                                    {this.state.isLoading ? <div className={classes.loading}>
                                        {loadingIndicator}
                                    </div> : null}
                                    <WishlistProduct
                                        layout="sidebar"
                                        data={wishlistItems}
                                        addToCart={this.addToCart}
                                        removeItem={this.removeItem}
                                    />
                                    <div className={classes.actions}>
                                        <Button priority="high" onClick={this.goToWishListPage}>
                                            Go to Wishlist
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    );
                }}
            </Query >
        );
    }

    onChange = formState => {
        const { values } = formState;
        const items = Object.assign({}, values.items);
        this.setState({ items: items })
    };

    update = () => {
        this.props.updateWishlist(this.state.items);
    }

    addToCart = payload => {
        const { client, getCartDetails } = this.props;

        this.setState({ isLoading: true });
        client.mutate({
            mutation: ADD_TO_CART,
            variables: { item: payload.item, qty: payload.qty },
            refetchQueries: [{ query: customerWishlistQuery }]
        }).then(result => {
            toast.success(`You have added ${payload.name} to your shopping cart.`);
            getCartDetails();
            console.log(result);
        }).catch((error) => {
            toast.error("Something's wrong.Please try again");
            console.log(error);
        }).finally(() => {
            this.setState({ isLoading: false });
        });
    };

    removeItem = itemId => {
        const { client } = this.props;

        this.setState({ isLoading: true });
        client.mutate({
            mutation: REMOVE_ITEM,
            variables: { item: itemId },
            refetchQueries: [{ query: customerWishlistQuery }]
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

const requests = [
    'USER/UPDATE_WISHLIST/',
    'USER/ADD_WISHLIST_TO_CART/'
];
const loadingSelector = createLoadingSelector(requests);

const mapStateToProps = ({ user, loading }) => {
    const { isSignedIn } = user;
    return {
        isSignedIn,
        isFetching: loadingSelector(loading)
    };
};

const mapDispatchToProps = {
    updateWishlist,
    getCartDetails,
    goToWishListPage
};

export default compose(
    withApollo,
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    classify(defaultClasses)
)(WishlistSidebar);