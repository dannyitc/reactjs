import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Price } from '@magento/peregrine';
import classify from 'src/classify';
import { Link, resourceUrl } from 'src/drivers';

import defaultClasses from './suggestedProduct.css';

const productUrlSuffix = '.html';
import PlaceHolderImage from 'src/components/Gallery/place_1.svg';

class SuggestedProduct extends Component {
    static propTypes = {
        handleOnProductOpen: PropTypes.func.isRequired,
        url_key: PropTypes.string.isRequired,
        small_image: PropTypes.string,
        name: PropTypes.string.isRequired,
        price: PropTypes.shape({
            regularPrice: PropTypes.shape({
                amount: PropTypes.shape({
                    currency: PropTypes.string,
                    value: PropTypes.number
                })
            })
        }).isRequired,
        classes: PropTypes.shape({
            root: PropTypes.string,
            productName: PropTypes.string,
            productImage: PropTypes.string
        })
    };

    render() {
        const {
            handleOnProductOpen,
            classes,
            url_key,
            small_image,
            name,
            price,
            special_price
        } = this.props;

        const productLink = resourceUrl(`/${url_key}${productUrlSuffix}`);

        return (
            <li className={classes.root}>
                <Link onClick={handleOnProductOpen} to={productLink}>
                    <img
                        onError={this.addDefaultSrc}
                        className={classes.productImage}
                        alt={name}
                        src={small_image ? resourceUrl(small_image, {
                            type: 'image-product',
                            width: 60
                        }) : PlaceHolderImage}
                    />
                </Link>
                <Link
                    onClick={handleOnProductOpen}
                    className={classes.productName}
                    to={productLink}
                >
                    {name}
                </Link>
                <Link onClick={handleOnProductOpen} to={productLink}>
                    {special_price
                        ? <div className={classes.price}>
                            <p className={classes.regularPrice}>
                                <Price
                                    currencyCode={price.regularPrice.amount.currency}
                                    value={price.regularPrice.amount.value}
                                />
                            </p>
                            <p className={classes.productPrice}>
                                < Price
                                    currencyCode={price.regularPrice.amount.currency}
                                    value={special_price}
                                />
                            </p>
                        </div>
                        : <p className={classes.productPrice}>
                            < Price
                                currencyCode={price.regularPrice.amount.currency}
                                value={price.regularPrice.amount.value}
                            />
                        </p>
                    }
                </Link>
            </li>
        );
    }

    addDefaultSrc(ev) {
        ev.target.src = PlaceHolderImage;
    }
}

export default classify(defaultClasses)(SuggestedProduct);
