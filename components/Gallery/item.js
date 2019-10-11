import React, { Component } from 'react';
import { compose } from 'redux';
import { Link, resourceUrl, connect } from 'src/drivers';
import classify from 'src/classify';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import HeartIcon from 'react-feather/dist/icons/heart';
import compareIcon from 'react-feather/dist/icons/bar-chart';
import { addItemToCart } from 'src/actions/cart';
import { togglePopup } from 'src/actions/app';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import LoadingIndicator from 'src/components/LoadingIndicator';
import { toast } from "react-toastify";
import defaultClasses from './item.css';
import PlaceHolderImage from './place_1.svg';
import Skeleton from 'react-loading-skeleton';
import compareQuery from 'src/queries/getCompareList.graphql';
import ProductPrice from 'src/components/ProductPrice';
import { withRouter } from 'react-router-dom';

const imageWidth = '300';
const imageHeight = '372';
const iconDimensions = { height: 20, width: 20 };

const ItemPlaceholder = ({ children, classes }) => (
    <div className={classes.root_pending}>
        <div className={classes.images_pending}>{children}</div>
        <div className={classes.name_pending} />
        <div className={classes.price_pending} />
    </div>
);

// TODO: get productUrlSuffix from graphql when it is ready
const productUrlSuffix = '.html';

const ADD_TODO_WISHLIST = gql`
  mutation addToWishlist($product: Int!) {
    addToWishlist(product: $product)
  }
`;

const ADD_TODO_COMPARE = gql`
    mutation addToCompare($product: Int!) {
        addToCompare(product: $product)
    }
`;

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
class GalleryItem extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false
        };
    }

    renderActionButton(item) {
        const { classes } = this.props;
        const type_id = item ? item.type_id : 'simple';
        const { url_key, is_available } = item;
        const productLink = `/${url_key}${productUrlSuffix}`;

        if (!is_available) {
            return <Button disabled priority="high">
                <span>Out of Stock</span>
            </Button>
        }

        return (
            <div className={classes.addToCartAction}>
                {type_id == 'configurable'
                    ? < Link to={productLink} className={classes.productLink}>
                        <Button classCustom='btnAddToCart' priority="high" >
                            <span>Add to Cart</span>
                        </Button>
                    </Link>
                    : <Button classCustom='btnAddToCart' priority="high" onClick={this.addToCart}>
                        <span>Add to Cart</span>
                    </Button>
                }
            </div>
        );
    }

    addToCart = () => {
        const { props } = this;
        const quantity = 1;
        const { item, addItemToCart, history, redirect_to_cart } = props;
        const productType = item.type_id == 'configurable'
            ? 'ConfigurableProduct'
            : 'SimpleProduct';

        const payload = {
            item: item,
            productType,
            quantity
        };

        addItemToCart(payload).then(() => {
            redirect_to_cart && history.push('/cart.html');
        });
    };

    addToCompare = () => {
        const { client, item } = this.props;
        this.setState({ isLoading: true });
        client.mutate({
            mutation: ADD_TODO_COMPARE,
            variables: { product: item.id },
            refetchQueries: [{ query: compareQuery }]
        }).then(result => {
            console.log(result);
            toast.success(`You have added ${item.name} to compare.`);
        }).catch(error => {
            console.log(error);
            toast.error("Something wrong.Please try again");
        }).finally(() => {
            this.setState({ isLoading: false });
        });;
    }

    addToWishList = () => {
        const { togglePopup, client, isSignedIn, item } = this.props;
        if (!isSignedIn) {
            togglePopup('signIn');
            return;
        }
        this.setState({ isLoading: true });
        client.mutate({
            mutation: ADD_TODO_WISHLIST,
            variables: { product: item.id },
            refetchQueries: [{ query: customerWishlistQuery }]
        }).then(result => {
            console.log(result);
            toast.success(`You have added ${item.name} to your wishlist.`);
        }).catch(error => {
            console.log(error);
            toast.error("Something's wrong.Please try again");
        }).finally(() => {
            this.setState({ isLoading: false });
        });
    }

    render() {
        const { layout, classes, item } = this.props;

        if (!item) {
            return (
                <ItemPlaceholder classes={classes}>
                    <Skeleton />
                </ItemPlaceholder>
            );
        }

        const { name, url_key } = item;
        const productLink = `/${url_key}${productUrlSuffix}`;

        let itemRootClass = null;

        switch (layout) {
            case 'listLayout':
                itemRootClass = classes.rootList;
                break;
            case 'sidebar':
                itemRootClass = classes.rootSidebar;
                break;
            default:
                itemRootClass = classes.root;
                break;
        }

        return (
            <div className={itemRootClass}>
                <div className={classes.itemInfo}>
                    <Link to={resourceUrl(productLink)} className={classes.images}>
                        {this.renderImage()}
                    </Link>
                    <Link to={resourceUrl(productLink)} className={classes.name}>
                        <span>{name}</span>
                    </Link>
                    <div className={classes.productDetails}>
                        <ProductPrice layout='category' product={item} onList={true} />
                        <div className={classes.actions}>
                            {this.renderActionButton(item)}
                            <div className={classes.addTo}>
                                <Button name="add-to-wishlist-button" priority="high" onClick={this.addToWishList}>
                                    <Icon src={HeartIcon} attrs={iconDimensions} />
                                </Button>
                                <Button name="add-to-compare-button" priority="high" onClick={this.addToCompare}>
                                    <Icon src={compareIcon} attrs={iconDimensions} />
                                </Button>
                            </div>
                        </div>
                    </div>
                    {this.state.isLoading
                        ? (<div className={classes.itemActionLoading}>
                            <LoadingIndicator>Adding..</LoadingIndicator>
                        </div>)
                        : null
                    }
                </div>
            </div>
        );
    }


    /**
     * TODO: Product images are currently broken and pending a fix from the `graphql-ce` project
     * https://github.com/magento/graphql-ce/issues/88
     */
    renderImage = () => {
        const { classes, item } = this.props;

        if (!item) {
            return null;
        }

        const { small_image, name } = item;

        return (
            <img
                onError={this.addDefaultSrc}
                className={classes.image}
                src={small_image ? resourceUrl(small_image, {
                    type: 'image-product',
                    width: imageWidth
                }) : PlaceHolderImage}
                alt={name}
                width={imageWidth}
                height={imageHeight}
            />
        );
    };

    addDefaultSrc(ev) {
        ev.target.src = PlaceHolderImage;
    }
}

const mapStateToProps = ({ catalog }) => {
    return {
        redirect_to_cart: catalog.storeConfig.redirect_to_cart
    };
};

const mapDispatchToProps = {
    addItemToCart,
    togglePopup
};

export default compose(
    withRouter,
    withApollo,
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(GalleryItem);
