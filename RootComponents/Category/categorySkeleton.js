import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import Gallery from 'src/components/Gallery';
import FilterModal from './FilterModal';
import defaultClasses from './category.css';

import Breadcrumbs from 'src/components/Breadcrumbs';
import Skeleton from 'react-loading-skeleton';

const pageSize = 4;
const emptyData = Array.from({ length: pageSize }).fill(null);

class CategoryContent extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            categorySidebar: PropTypes.string,
            categoryMainContent: PropTypes.string,
            categoryProducts: PropTypes.string,
            title: PropTypes.string,
            headerButtons: PropTypes.string,
            gallery: PropTypes.string,
            pagination: PropTypes.string,
            filterContainer: PropTypes.string
        })
    };

    constructor(props) {
        super(props);
        this.state = {
            windowWidth: window.innerWidth
        };
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange = () => {
        this.setState({ windowWidth: window.innerWidth });
    };

    get filterModal() {
        return <FilterModal isLoading={true} />
    }

    get sidebar() {
        const { classes } = this.props;

        return <div className={classes.categorySkeletonSidebar}>
            {this.filterModal}
            <div className={classes.sidebarBlocks}>
                <Skeleton width='100%' height='200px' />
            </div>
        </div>
    }

    get categoryPageContent() {
        const { classes } = this.props;

        return (
            <div className={classes.categoryMainContent}>
                <div className={classes.categoryOverview}>
                    <Skeleton />
                </div>
                <div className={classes.productList}>
                    <div className={classes.displayMode}>
                        <Skeleton />
                        <Skeleton />
                    </div>
                    <Skeleton />
                    <section className={classes.gallery}>
                        <Gallery layout='fourItems' pageSize={pageSize} data={emptyData} />
                    </section>
                    <div className={classes.pagination}>
                        <Skeleton />
                        <Skeleton />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <article className={classes.root}>
                <Breadcrumbs />
                <div className={classes.categoryPageContent}>
                    {this.sidebar}
                    {this.categoryPageContent}
                </div>
            </article>
        );
    }
}

export default classify(defaultClasses)(CategoryContent);
