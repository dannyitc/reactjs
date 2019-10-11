import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { arrayOf, func, number, shape, string } from 'prop-types';
import { Form } from 'informed';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import xClose from 'react-feather/dist/icons/x';
import { resourceUrl } from 'src/drivers';

import classify from 'src/classify';
import defaultClasses from './product.css';

const imageWidth = 80;
const imageHeight = 100;

import PlaceHolderImage from 'src/components/Gallery/place_1.svg';
import CartItemPrice from 'src/components/CartItemPrice';

const iconDimensions = { height: 18, width: 18 };

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
            root: string,
            productOptions: string
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
        currencyCode: string.isRequired,
        openOptionsDrawer: func.isRequired
    };

    // TODO: Manage favorite items using GraphQL/REST when it is ready
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isFavorite: false,
            qty: props.item.qty,
            showMenu: false
        };
        // this.showMenu = this.showMenu.bind(this);
        // this.closeMenu = this.closeMenu.bind(this);
    }

    showMenu = () => {
        const { showMenu } = this.state;

        this.setState({
            showMenu: !showMenu
        });
    }

    get options() {
        const { classes, item } = this.props;
        const options = item.options;

        return options && options.length > 0 ? (
            <dl className={classes.options} ref={(element) => {
                this.dropdownMenu = element;
            }}
            >
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

    get updateButton() {
        const { classes, item } = this.props;
        return this.state.qty != item.qty ? (
            <div className={classes.updateButton}>
                <Button name="update-qty-button" priority="high" type="submit">
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

    onChangeQty = (event) => {
        const value = event.target.value;
        this.setState({
            qty: (!value || value > 0) ? event.target.value : 1
        });
    };

    render() {
        const { options, props, updateQty, updateButton } = this;
        const { classes, item } = props;
        const rootClasses = this.state.isOpen
            ? classes.root + ' ' + classes.root_masked
            : classes.root;
        const closeStyle = {
            color: '#D69229'
        };
        return (
            <li className={rootClasses}>
                <div className={classes.image}>
                    {this.renderImage(item.image)}
                </div>
                <div className={classes.name}>{item.name}</div>
                <div className={classes.productOptions}>
                    <span
                        onClick={this.showMenu}
                    >
                        {`See Details`}
                    </span>
                    {
                        this.state.showMenu && options
                    }

                </div>
                <div className={classes.quantity}>
                    <div className={classes.quantityRow}>
                        <CartItemPrice customClass='miniCart' type={'price'} item={item} />
                        <div className={classes.itemActions}>
                            <Form
                                className={classes.formQtyUpdate}
                                onSubmit={updateQty}
                            >
                                <span className={classes.lableQty}>{`Qty:`}</span>
                                <input
                                    className={classes.cartInputQty}
                                    value={this.state.qty}
                                    onChange={this.onChangeQty}
                                    label={'Qty: '}
                                    placeholder=""
                                    field="minicart_item_qty"
                                    type="number"
                                />
                                {updateButton}
                            </Form>
                            <button
                                className={classes.removeItemButton}
                                onClick={this.removeItem}
                                style={closeStyle}
                            >
                                <Icon src={xClose} attrs={iconDimensions} />
                            </button>
                        </div>
                    </div>
                </div>
            </li>
        );
    }

    updateQty = () => {
        const { item } = this.props;
        this.props.updateItemFromCart(
            {
                item: item,
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
        this.props.openOptionsDrawer(this.props.item);
    };

    removeItem = () => {
        // TODO: prompt user to confirm this action
        this.props.removeItemFromCart({
            item: this.props.item
        });
    };
}

export default classify(defaultClasses)(Product);
