import React, { Component, Fragment } from 'react';
import { arrayOf, number, shape, string } from 'prop-types';
import TextInput from 'src/components/TextInput';
import Button from 'src/components/Button';
import { resourceUrl } from 'src/drivers';

import classify from 'src/classify';
import defaultClasses from './product.css';
import CartItemPrice from 'src/components/CartItemPrice';

const imageWidth = 150;
const imageHeight = 170;

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
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isFavorite: false,
            qty: props.item.qty
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

    get updateButton() {
        const { classes, item } = this.props;
        return this.state.qty != item.qty ? (
            <div className={classes.updateButton}>
                <Button onClick={this.updateQty} name="update-qty-button" priority="high" type="button">
                    Update
                </Button>
            </div>
        ) : null;
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

    styleImage(image) {
        return {
            height: imageHeight, // min-height instead of height so image will always align with grid bottom
            width: imageWidth,
            backgroundImage: `url(${resourceUrl(image.file, {
                type: 'image-product',
                width: imageWidth
            })})`
        };
    }

    onChangeQty = (event) => {
        const value = event.target.value;
        this.setState({
            qty: (!value || value > 0) ? value : 1
        });
    };

    render() {
        const { options, props, updateButton } = this;
        const { classes, item } = props;
        const fieldName = `${item.item_id}`;

        return (
            <div className={classes.cartItems}>
                <div className={classes.cartItemWrap}>
                    <div className={classes.cartItem}>
                        <div className={classes.cartItemInfo}>
                            <div className={classes.image}>
                                {this.renderImage(item.image)}
                            </div>
                            <div className={classes.name}>{item.name}</div>
                            {options}
                        </div>
                        <CartItemPrice type={'price'} item={item}/>
                        <div label="" className={classes.cartItemQty}>
                            <TextInput
                                label=""
                                initialValue={item.qty.toString()}
                                field={fieldName}
                                onChange={this.onChangeQty}
                            />
                            {updateButton}
                        </div>
                        <CartItemPrice type={'subtotal'} item={item}/>
                    </div>
                    <div className={classes.itemActions}>
                        <button
                            className={classes.removeItemButton}
                            onClick={this.removeItem}
                        >
                            {'Remove Item'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    updateQty = () => {
        const { item } = this.props;
        this.props.updateItemFromCart(
            {
                item: this.props.item,
                quantity: this.state.qty
            },
            item.item_id
        );
    };

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