import React, { Component } from 'react';
import { connect } from 'src/drivers';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import { toggleCart } from 'src/actions/cart';
import CartCounter from './cartCounter';

import Icon from 'src/components/Icon';
import ShoppingCartIcon from 'react-feather/dist/icons/shopping-cart';
import ChevronDownIcon from 'react-feather/dist/icons/chevron-down';
import classify from 'src/classify';
import defaultClasses from './cartTrigger.css';
import loadingIcon from './Spinner-0.8s-41px.svg';

export class Trigger extends Component {
    static propTypes = {
        children: PropTypes.node,
        classes: PropTypes.shape({
            root: PropTypes.string,
            cartName: PropTypes.string
        }),
        toggleCart: PropTypes.func.isRequired,
        itemsQty: PropTypes.number
    };

    get cartIcon() {
        const {
            cart: { details }
        } = this.props;
        const itemsQty = details ? details.items_qty : 0;
        const iconColor = 'rgb(var(--venia-text))';
        let svgAttributes = {
            stroke: iconColor
        };

        if (itemsQty > 0) {
            svgAttributes.fill = iconColor;
        }

        return <Icon src={ShoppingCartIcon} attrs={svgAttributes} />;
    }

    render() {
        const {
            classes,
            toggleCart,
            isActive,
            cart: { details, loading }
        } = this.props;
        const { cartIcon } = this;
        const itemsQty = details ? details.items_qty : 0;
        const className = isActive ? classes.rootActive : classes.root;
        return (
            <button
                className={className}
                aria-label="Toggle mini cart"
                onClick={toggleCart}
            >
                <span>Cart</span>
                {/* {loading &&
                    <img
                        className={classes.loading}
                        src={loadingIcon}
                        alt="Reload Cart"
                        title="Reload Cart"
                    />
                } */}
                <CartCounter counter={itemsQty ? itemsQty : 0} />
                <Icon className={classes.toggleIcon} src={ChevronDownIcon} size={15} />
            </button>
        );
    }
}

const mapStateToProps = ({ cart }) => ({ cart });

const mapDispatchToProps = {
    toggleCart
};

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Trigger);
