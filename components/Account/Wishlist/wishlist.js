import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './wishlist.css';
import { Form } from 'informed';
import WishlistProduct from '../WishlistProduct';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { compose } from 'redux';
import { Query } from 'react-apollo';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import { toast } from "react-toastify";
import { connect } from 'src/drivers';
import { updateWishlist } from 'src/actions/user';
import { getCartDetails } from 'src/actions/cart';
import { createLoadingSelector } from 'src/selectors/loading';
import Button from 'src/components/Button';

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

const ADD_ALL_TO_CART = gql`
mutation addWistlistToCart($items: String!) {
    addWistlistToCart(items: $items) {
        type
        text
    }
  }
`;

class CustomerWishlist extends Component {
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

    componentDidMount() {
        document.title = 'My wishlist';
    }

    render() {
        const { classes, isFetching } = this.props;

        return (
            <Query
                query={customerWishlistQuery}
                fetchPolicy={"no-cache"}
            >
                {({ loading, error, data }) => {
                    if (error) return null;
                    if (loading)
                        return loadingIndicator;
                    const wishlistItems = data.customer ? data.customer.wishlist : null;
                    if (!wishlistItems) return (
                        <div>
                            <p>You have no items in your wish list.</p>
                        </div>
                    );
                    return (
                        <Form
                            className={classes.formWishlistItems}
                            onChange={this.onChange}
                        >
                            {isFetching && loadingIndicator}
                            <h1>My Wishlist</h1>
                            {this.state.isLoading ? <div className={classes.loading}>
                                {loadingIndicator}
                            </div> : null}
                            <WishlistProduct
                                layout="fourItems"
                                data={wishlistItems}
                                addToCart={this.addToCart}
                                removeItem={this.removeItem}
                            />
                            <div className={classes.actions}>
                                <Button type="button" priority="high" onClick={this.addAllToCart}>
                                    {'Add All to Cart'}
                                </Button>
                                <Button type="button" priority="high" onClick={this.update}>
                                    {'Update Wish List'}
                                </Button>
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

    addAllToCart = () => {
        const { client, getCartDetails } = this.props;

        this.setState({ isLoading: true });
        client.mutate({
            mutation: ADD_ALL_TO_CART,
            variables: { items: JSON.stringify(this.state.items) },
            refetchQueries: [{ query: customerWishlistQuery }]
        }).then(result => {
            result.data.addWistlistToCart.forEach(function (message) {
                message.type == 'error' && toast.error(message.text);
                message.type == 'success' && toast.success(message.text);
            });
            getCartDetails();
        }).catch((error) => {
            toast.error("Something's wrong.Please try again");
            console.log(error);
        }).finally(() => {
            this.setState({ isLoading: false });
        });

    }

    addToCart = payload => {
        const { client, getCartDetails } = this.props;

        this.setState({ isLoading: true });
        client.mutate({
            mutation: ADD_TO_CART,
            variables: { item: payload.item, qty: payload.qty },
            refetchQueries: [{ query: customerWishlistQuery }]
        }).then(() => {
            toast.success('Product has been added to cart successfully');
            getCartDetails();
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
    'USER/UPDATE_WISHLIST/'
];
const loadingSelector = createLoadingSelector(requests);

const mapStateToProps = ({ loading }) => ({
    isFetching: loadingSelector(loading)
});

const mapDispatchToProps = {
    updateWishlist,
    getCartDetails
};

export default compose(
    withApollo,
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    classify(defaultClasses)
)(CustomerWishlist);