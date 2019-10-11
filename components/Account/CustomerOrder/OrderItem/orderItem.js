import React, { Component, Fragment } from 'react';
import { string, number, shape } from 'prop-types';
import { compose } from 'redux';
import { resourceUrl, connect } from 'src/drivers';
import { Price } from '@magento/peregrine';
import classify from 'src/classify';
import { transparentPlaceholder } from 'src/shared/images';

import defaultClasses from './orderItem.css';

const imageWidth = '50';
const imageHeight = '50';

const ItemPlaceholder = ({ children, classes }) => (
    <div className={classes.root_pending}>
        <div className={classes.images_pending}>{children}</div>
        <div className={classes.name_pending} />
        <div className={classes.price_pending} />
    </div>
);

// TODO: get productUrlSuffix from graphql when it is ready
const productUrlSuffix = '.html';

class OrderItem extends Component {
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
            root: string,
            root_pending: string,
            regularPrice: string,
            regularTitle: string
        }),
        item: shape({
            id: number.isRequired,
            name: string.isRequired,
            price: number,
            quantity: number.isRequired,
            subtotal: number
        })
    };

    render() {
        const { classes, item, cart } = this.props;

        if (!item) {
            return (
                <ItemPlaceholder classes={classes}>
                    {this.renderImagePlaceholder()}
                </ItemPlaceholder>
            );
        }

        const { name, price, quantity, subtotal, sku } = item;

        return (
            <div className={classes.root}>
                <div className={classes.productInfo}>
                    <span>{name}</span>
                </div>
                <div className={classes.productInfo}>
                    <span>{sku}</span>
                </div>
                <div className={classes.productUnitPrice}>
                    <div className={classes.price}>
                        <p className={classes.productPrice}>
                            < Price
                                currencyCode={cart.totals.base_currency_code}
                                value={price}
                            />
                        </p>
                    </div>
                </div>
                <div className={classes.productQty}>
                    <span>{quantity}</span>
                </div>
                <div className={classes.subtotal}>
                    <p>
                        < Price
                            currencyCode={cart.totals.base_currency_code}
                            value={subtotal}
                        />
                    </p>
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
                className={classes.image}
                src={resourceUrl(small_image, {
                    type: 'image-product',
                    width: imageWidth
                })}
                alt={name}
                width={imageWidth}
                height={imageHeight}
            />
        );
    };
}

const mapStateToProps = ({ cart }) => ({ cart });

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        null
    )
)(OrderItem);
