import React, { Component, Fragment } from 'react';
import { string, shape } from 'prop-types';
import { compose } from 'redux';
import { Link, resourceUrl, connect } from 'src/drivers';
import { Price } from '@magento/peregrine';
import classify from 'src/classify';
import { transparentPlaceholder } from 'src/shared/images';
import Button from 'src/components/Button';
import Field from 'src/components/Field';
import TextArea from 'src/components/TextArea';
import TextInput from 'src/components/TextInput';
import Icon from 'src/components/Icon';
import DeleteIcon from 'react-feather/dist/icons/trash-2';
import xIcon from 'react-feather/dist/icons/x';
import { addItemToCart } from 'src/actions/cart';

import defaultClasses from './item.css';

const imageWidth = '300';
const imageHeight = '372';

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
            addToCart: string,
            root: string,
            root_pending: string,
            regularPrice: string,
            regularTitle: string
        })
    };

    constructor() {
        super();
        this.state = {
            qty: null
        };
    }

    onChangeQty = (event) => {
        const value = event.target.value;
        this.setState({
            qty: (!value || value > 0) ? event.target.value : 1
        });
    };

    addToCart = () => {
        const { props } = this;
        const { item, addToCart } = props;

        const payload = {
            item: item.id,
            qty: this.state.qty ? this.state.qty : item.qty,
            name: item.name
        };

        addToCart(payload);
    };

    get price() {
        const { item, classes } = this.props;
        const { currency, type_id, special_price, price, final_price } = item;

        if (type_id == 'configurable' || !special_price) {
            return (
                <p className={classes.productPrice}>
                    < Price
                        currencyCode={currency}
                        value={final_price}
                    />
                </p>
            );
        }

        return (
            <Fragment>
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
            </Fragment>
        );
    }

    remove = () => {
        const { props } = this;
        const { item, removeItem } = props;

        removeItem(item.id);
    };

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
                        <Button priority="high" >
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

    render() {
        const { classes, layout, item } = this.props;

        if (!item) {
            return (
                <ItemPlaceholder classes={classes}>
                    {this.renderImagePlaceholder()}
                </ItemPlaceholder>
            );
        }

        const fieldQtyName = `items[${item.id}].qty`;
        const fieldCommentName = `items[${item.id}].des`;

        const { name, url_key, qty } = item;
        const productLink = `/${url_key}${productUrlSuffix}`;
        const wishListItemClass = layout != 'sidebar' ? classes.root : classes.rootSidebar;
        return (
            <div className={wishListItemClass}>
                <Link to={resourceUrl(productLink)} className={classes.images}>
                    {this.renderImage()}
                </Link>
                <div className={classes.itemInfo}>
                    <Link to={resourceUrl(productLink)} className={classes.name}>
                        <span>{name}</span>
                    </Link>
                    {layout != 'sidebar'
                        ? <Field>
                            <TextArea
                                initialValue={item.description}
                                field={fieldCommentName}
                            />
                        </Field>
                        : null
                    }
                    <div className={classes.price}>
                        {this.price}
                    </div>
                    {layout != 'sidebar'
                        ? <Field label="Qty" className={classes.wishlistItemQty}>
                            <TextInput
                                label=""
                                initialValue={qty.toString()}
                                field={fieldQtyName}
                                onChange={this.onChangeQty}
                            />
                        </Field>
                        : null
                    }
                    <div className={classes.cartActions}>
                        {this.renderActionButton(item)}
                    </div>
                    <div className={classes.itemActions}>
                        {layout != 'sidebar'
                            ? <Button priority="high" onClick={this.remove}>
                                <Icon src={DeleteIcon} size={14} />
                                Remove Item
                            </Button>
                            : <Button priority="high" onClick={this.remove}>
                                <Icon src={xIcon} size={14} />
                            </Button>
                        }
                    </div>
                </div>
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
                width={imageWidth}
                height={imageHeight}
            />
        );
    };

    addDefaultSrc(ev) {
        ev.target.src = PlaceHolderImage;
    }
}

const mapDispatchToProps = {
    addItemToCart
};

export default compose(
    classify(defaultClasses),
    connect(
        null,
        mapDispatchToProps
    )
)(Item);
