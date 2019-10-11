import React, { Component, Fragment } from 'react';
import { arrayOf, number, shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';

import classify from 'src/classify';
import { resourceUrl } from "@magento/venia-drivers";
import defaultClasses from './product.css';

const imageWidth = 80;
const imageHeight = 100;

import PlaceHolderImage from 'src/components/Gallery/place_1.svg';

class Product extends Component {
    static propTypes = {
        classes: shape({
            image: string,
            modal: string,
            name: string,
            optionLabel: string,
            options: string,
            price: string,
            quantity: string,
            quantityOperator: string,
            quantityRow: string,
            quantitySelect: string,
            root: string
        }),
        item: shape({
            item_id: number.isRequired,
            name: string.isRequired,
            options: arrayOf(
                shape({
                    label: string,
                    value: string
                })
            ),
            price: number.isRequired,
            product_type: string,
            qty: number.isRequired,
            quote_id: string,
            sku: string.isRequired
        }).isRequired,
        currencyCode: string.isRequired
    };

    // TODO: Manage favorite items using GraphQL/REST when it is ready
    constructor() {
        super();
        this.state = {
            isOpen: false,
            isFavorite: false
        };
    }

    get options() {
        const { classes, item } = this.props;
        const options = item.options;

        return options && options.length > 0 ? (
            <dl className={classes.options}>
                {options.map(({ label, value }) => (
                    <Fragment key={`${label}${value}`}>
                        <dt className={classes.optionLabel}>
                            {label} : {value}
                        </dt>
                    </Fragment>
                ))}
            </dl>
        ) : null;
    }

    get modal() {
        const { classes } = this.props;
        return this.state.isOpen ? <div className={classes.modal} /> : null;
    }

    /**
     * TODO: Product images are currently broken and pending a fix from the `graphql-ce` project
     * https://github.com/magento/graphql-ce/issues/88
     */
    renderImage(image) {
        const { classes } = this.props;
        return (
            <img
                onError={this.addDefaultSrc}
                className={classes.imageContent}
                src={image.file ? resourceUrl(image.file, {
                    type: 'image-product',
                    width: imageWidth
                }) : PlaceHolderImage}
                alt=''
                width={imageWidth}
                height={imageHeight}
            />
        );
    }

    addDefaultSrc(ev) {
        ev.target.src = PlaceHolderImage;
    }

    render() {
        const { options, props } = this;
        const { classes, item, currencyCode } = props;
        const rootClasses = this.state.isOpen
            ? classes.root + ' ' + classes.root_masked
            : classes.root;

        return (
            <li className={rootClasses}>
                <div className={classes.image}>
                    {this.renderImage(item.image)}
                </div>
                <div className={classes.name}>{item.name}</div>
                {options}
                <div className={classes.quantity}>
                    <div className={classes.quantityRow}>
                        <span className={classes.quantitySelect}>
                            Qty: {item.qty}
                        </span>
                        <span className={classes.price}>
                            <Price
                                currencyCode={currencyCode}
                                value={item.price}
                            />
                        </span>
                    </div>
                </div>
            </li>
        );
    }

    favoriteItem = () => {
        this.setState({
            isFavorite: true
        });
    };

    editItem = () => {
        this.props.showEditPanel(this.props.item);
    };

    removeItem = () => {
        // TODO: prompt user to confirm this action
        this.props.removeItemFromCart({
            item: this.props.item
        });
    };
}

export default classify(defaultClasses)(Product);
