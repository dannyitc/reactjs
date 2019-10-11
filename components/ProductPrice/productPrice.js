import React, { Component, Fragment } from 'react';
import { Price } from '@magento/peregrine';
import { compose } from 'redux';
import { connect } from 'src/drivers';
import classify from 'src/classify';
import defaultClasses from './productPrice.css';

const BOTH = 3;

class ProductPrice extends Component {

    render() {
        const { classes, product, tax_display_type, base_currency_code, onList } = this.props;

        if (!product) return null;

        const isConfig = product.type_id == 'configurable';
        const { price } = product;

        const { regularPrice, minimalPrice } = price || {};

        if (!regularPrice || !minimalPrice) return null;

        const regularValue = regularPrice.amount.value;
        const minimalValue = minimalPrice.amount.value;
        const taxRegular = regularPrice.adjustments[0];
        const taxMinimal = minimalPrice.adjustments[0];
        const realMinimal = taxRegular && taxMinimal ? minimalValue - taxMinimal.amount.value : minimalValue;

        const configTitle = onList ? classes.configTitleList : classes.configTitle;
        const excludePrice = onList ? classes.excludePriceList : classes.excludePrice;
        const productPrice = onList ? classes.productPriceList : classes.productPrice;
        const regular = onList ? classes.regularPriceList : classes.regularPrice;
        const layoutPage = this.props.layout;
        if (tax_display_type == BOTH) {
            return (
                <div className={classes.priceBox}>
                    {isConfig && layoutPage != 'category' && <p className={configTitle}>As low as</p>}
                    <p className={productPrice}>
                        <Price
                            currencyCode={base_currency_code}
                            value={minimalValue}
                        />
                    </p>
                    {
                        minimalValue < regularValue && !isConfig &&
                        <Fragment>
                            {!onList && <p className={classes.regularTitle}>{"Regular Price"}</p>}
                            <p className={regular}>
                                <Price
                                    currencyCode={base_currency_code}
                                    value={regularValue}
                                />
                            </p>
                        </Fragment>
                    }
                    {layoutPage != 'category' ?
                        <p className={excludePrice}>
                            <span>Excl.Tax: </span>
                            <Price
                                currencyCode={base_currency_code}
                                value={realMinimal}
                            />
                        </p>
                        : null
                    }
                </div>
            );
        }
        return (
            <div className={classes.priceBox}>
                {isConfig && <p className={configTitle}>As low as</p>}
                <p className={productPrice}>
                    <Price
                        currencyCode={base_currency_code}
                        value={minimalValue}
                    />
                </p>
                {
                    minimalValue < regularValue && !isConfig &&
                    <Fragment>
                        {!onList && <p className={classes.regularTitle}>{"Regular Price"}</p>}
                        <p className={regular}>
                            <Price
                                currencyCode={base_currency_code}
                                value={regularValue}
                            />
                        </p>
                    </Fragment>
                }
            </div>
        );
    }
}

const mapStateToProps = ({ catalog }) => {
    const { tax_display_type, base_currency_code } = catalog.storeConfig;
    return {
        tax_display_type,
        base_currency_code
    };
};

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        null
    )
)(ProductPrice);