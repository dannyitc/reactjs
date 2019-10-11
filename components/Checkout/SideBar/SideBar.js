import React from 'react';
import defaultClasses from './SideBar.css';
import classify from 'src/classify';
import OrderSummary from './OrderSummary';
import ShipTo from './ShipTo';
import ShippingMethodSummary from './ShippingMethodSummary';

class SideBar extends React.Component {
   
    render() {
        const {
            classes,
            hasShippingAddress,
            shippingAddress,
            cart,
            shippingTitle,
            hasShippingMethod,
            step,
            editShippingMethod,
            editAddress
        } = this.props;

        return (
            <div className={classes.checkoutSidebar}>
                <div className={classes.body}>
                    <OrderSummary cart={cart} step={step} />
                    {step > 1 &&
                        <ShipTo
                            hasShippingAddress={hasShippingAddress}
                            shippingAddress={shippingAddress}
                            editAddress={editAddress}
                        />
                    }
                    {step > 2 &&
                        <ShippingMethodSummary
                            shippingTitle={shippingTitle}
                            hasShippingMethod={hasShippingMethod}
                            editShippingMethod={editShippingMethod}
                        />
                    }
                </div>
            </div>
        );
    }

}

export default classify(defaultClasses)(SideBar);
