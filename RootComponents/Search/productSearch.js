import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import Gallery from 'src/components/Gallery';
import Pagination from 'src/components/Pagination';

import defaultClasses from './productSearch.css';

class ProductSearch extends Component {
    static propTypes = {
        classes: PropTypes.shape({
        })
    };

    get productSearchContent() {
        const { classes, pageControl, data, pageSize } = this.props;

        return (
            <div className={classes.productSearchContent}>
                <section className={classes.gallery}>
                    <Gallery layout="fourItems" data={data.products.items} pageSize={pageSize}/>
                </section>
                <div className={classes.pagination}>
                    <Pagination pageControl={pageControl} />
                </div>
            </div>
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <article className={classes.root}>
                {this.productSearchContent}
            </article>
        );
    }
}

export default classify(defaultClasses)(ProductSearch);
