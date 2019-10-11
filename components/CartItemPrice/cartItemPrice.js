import React, { Component } from 'react';
import { Price } from '@magento/peregrine';
import { compose } from 'redux';
import { connect } from 'src/drivers';
import classify from 'src/classify';
import defaultClasses from './cartItemPrice.css';

const EXCL = 1;
const INCL = 2;

class CartItemPrice extends Component {

    render() {
        const { classes, item, tax_cart_display_price, base_currency_code, type, totals } = this.props;

        if (!item) return null;

        const matchingItem = totals.items.find(
            t => t.item_id === item.item_id
        );

        const { price, price_incl_tax, row_total, row_total_incl_tax } = matchingItem;

        let main_price, add_price, main_sub, add_sub;

        if (!tax_cart_display_price || tax_cart_display_price == EXCL) {
            main_price = price;
            main_sub = row_total;
        } else if (tax_cart_display_price == INCL) {
            main_price = price_incl_tax;
            main_sub = row_total_incl_tax;
        } else {
            main_price = price_incl_tax;
            add_price = price;
            main_sub = row_total_incl_tax;
            add_sub = row_total;
        }

        if (type == 'price') {
            const getCustomClass =  this.props.customClass == 'miniCart' ? classes.minCart : '';
            return (
                <div className={`${classes.cartItemPrice} ${getCustomClass}`}>
                    <span className={classes.price}>
                        <Price
                            currencyCode={base_currency_code}
                            value={main_price}
                        />
                    </span>
                    {add_price &&
                        <p className={classes.excludePrice}>
                            <span>Excl.Tax: </span>
                            <Price
                                currencyCode={base_currency_code}
                                value={add_price}
                            />
                        </p>
                    }
                </div>
            );
        }

        return (
            <div className={classes.cartItemSubtotal}>
                <span className={classes.price}>
                    <Price
                        currencyCode={base_currency_code}
                        value={main_sub}
                    />
                </span>
                {add_sub &&
                    <p className={classes.excludePrice}>
                        <span>Excl.Tax: </span>
                        <Price
                            currencyCode={base_currency_code}
                            value={add_sub}
                        />
                    </p>
                }
            </div>
        );

    }
}

const mapStateToProps = ({ catalog, cart }) => {
    const { tax_cart_display_price, base_currency_code } = catalog.storeConfig;
    const { totals } = cart;
    return {
        tax_cart_display_price,
        base_currency_code,
        totals
    };
};

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        null
    )
)(CartItemPrice);