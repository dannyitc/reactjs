import React, { Component, Fragment } from 'react';
import { string, shape } from 'prop-types';
import { compose } from 'redux';
import { Link, resourceUrl, connect } from 'src/drivers';
import { Price } from '@magento/peregrine';
import classify from 'src/classify';
import { transparentPlaceholder } from 'src/shared/images';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import { addItemToCart } from 'src/actions/cart';
import xIcon from 'react-feather/dist/icons/x';
import defaultClasses from './item.css';
import globalClasses from 'src/index.css';
import {
    openComparePopup
} from 'src/actions/catalog';

const imageWidth = '150';
const imageHeight = '150';

import PlaceHolderImage from 'src/components/Gallery/place_1.svg';

const ItemPlaceholder = ({ children, classes }) => (
    <div className={classes.root_pending}>
        <div className={classes.images_pending}>{children}</div>
        <div className={classes.name_pending} />
        <div className={classes.price_pending} />
    </div>
);

// TODO: get productUrlSuffix from graphql when it is ready
const productUrlSuffix = '.html';

class Item extends Component {
    static propTypes = {
        classes: shape({
            image: string,
            image_pending: string,
            imagePlaceholder: string,
            imagePlaceholder_pending: string,
            images: string,
            images_pending: string,
            name: string,
            name_pending: string,
            price: string,
            price_pending: string,
            addItemToCart: string,
            root: string,
            root_pending: string,
            regularPrice: string,
            regularTitle: string
        })
    };

    addToCart = () => {
        const { props } = this;
        const { item } = props;
        const quantity = 1;
        const productType = item.type_id == 'configurable'
            ? 'ConfigurableProduct'
            : 'SimpleProduct';

        const payload = {
            item: item,
            productType,
            quantity
        };

        this.props.addItemToCart(payload);
    };

    remove = () => {
        const { props } = this;
        const { item, removeItem } = props;

        removeItem(item.id);
    };

    hideComparePopup = () => {
        const { modalIsOpen } = globalClasses;
        const bodyClasses = document.querySelector('body').classList;
        this.props.openComparePopup(false);
        bodyClasses.remove(modalIsOpen)
    };

    render() {
        const { classes, item } = this.props;

        if (!item) {
            return (
                <ItemPlaceholder classes={classes}>
                    {this.renderImagePlaceholder()}
                </ItemPlaceholder>
            );
        }

        const { name, price, url_key, currency, special_price } = item;
        const productLink = `/${url_key}${productUrlSuffix}`;

        return (
            <div className={classes.itemInfo}>
                <div className={classes.itemActions}>
                    <Button priority="high" onClick={this.remove}>
                        <Icon src={xIcon} size={16} />
                    </Button>
                </div>
                <Link to={resourceUrl(productLink)} onClick={this.hideComparePopup} className={classes.images}>
                    {this.renderImage()}
                </Link>
                <Link to={resourceUrl(productLink)} className={classes.name}>
                    <span>{name}</span>
                </Link>
                <div className={classes.price}>
                    {special_price
                        ? (< Fragment >
                            <p className={classes.productPrice}>
                                < Price
                                    currencyCode={currency}
                                    value={special_price}
                                />
                            </p>
                            <p className={classes.regularTitle}>{"Regular Price"}</p>
                            <p className={classes.regularPrice}>
                                <Price
                                    currencyCode={currency}
                                    value={price}
                                />
                            </p>
                        </Fragment>)
                        : <p className={classes.productPrice}>
                            < Price
                                currencyCode={currency}
                                value={price}
                            />
                        </p>
                    }
                </div>
                <div className={classes.cartActions}>
                    {this.renderActionButton(item)}
                </div>
            </div>
        );
    }

    renderActionButton(item) {
        const { classes } = this.props;
        const type_id = item ? item.type_id : 'simple';
        const { url_key, is_available } = item;
        const productLink = `/${url_key}${productUrlSuffix}`;

        if (is_available == 'false') {
            return <Button disabled priority="high">
                <span>Out of Stock</span>
            </Button>
        }

        return (
            <div className={classes.addToCartAction}>
                {type_id == 'configurable'
                    ? < Link to={productLink} className={classes.productLink}>
                        <Button priority="high" onClick={this.hideComparePopup}>
                            <span>Add to Cart</span>
                        </Button>
                    </Link>
                    : <Button priority="high" onClick={this.addToCart}>
                        <span>Add to Cart</span>
                    </Button>
                }
            </div>
        );
    }

    renderImagePlaceholder = () => {
        const { classes, item } = this.props;

        const className = item
            ? classes.imagePlaceholder
            : classes.imagePlaceholder_pending;

        return (
            <img
                className={className}
                src={transparentPlaceholder}
                alt=""
                width={imageWidth}
                height={imageHeight}
            />
        );
    };

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
            />
        );
    };

    addDefaultSrc(ev) {
        ev.target.src = PlaceHolderImage;
    }
}
const mapStateToProps = ({ catalog }) => {
    return {
        isPopupCompareOpen: catalog.isPopupCompareOpen
    };
};

const mapDispatchToProps = {
    addItemToCart,
    openComparePopup
};

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Item);
