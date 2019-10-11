import React, { Component } from 'react';
import { Form } from 'informed';
import classify from 'src/classify';
import Icon from 'src/components/Icon';
import chevronUpIcon from 'react-feather/dist/icons/chevron-up';
import chevronDownIcon from 'react-feather/dist/icons/chevron-down';
import defaultClasses from './productFullDetail.css';

import Breadcrumbs from 'src/components/Breadcrumbs';

const iconAttrs = {
    width: 14
};

import Skeleton from 'react-loading-skeleton';

class ProductSkeleton extends Component {

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Form className={classes.root}>
                    <Breadcrumbs />
                    <div className={classes.productViewInfoTop}>
                        <div className={classes.productViewInfoMain}>
                            <section className={classes.imageCarousel}>
                                <Skeleton height='400px' width='320px' />
                            </section>
                            <section className={classes.title}>
                                <h1 className={classes.productName}>
                                    <Skeleton />
                                </h1>
                                <div className={classes.reviewInfo}>
                                    <div className={classes.reviewActions}>
                                        <Skeleton />
                                    </div>

                                </div>
                                <p className={classes.productShortDescription}>
                                    <Skeleton />
                                </p>
                                <div className={classes.productStockSku}>
                                    <Skeleton />
                                </div>
                                <Skeleton />
                            </section>
                            <section className={classes.options}>
                                <Skeleton />
                            </section>
                            <section className={classes.cartActions}>
                                <Skeleton height='90px'/>
                            </section>
                        </div>
                    </div>
                </Form>
                <div className={classes.root}>
                    <div className={classes.productViewDetailed}>
                        <div className={classes.productViewTabs}>
                            <Skeleton height='400px' />
                        </div>
                        <div className={classes.customBlock}>
                            <Skeleton height='265px' width='265px' />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(ProductSkeleton);


