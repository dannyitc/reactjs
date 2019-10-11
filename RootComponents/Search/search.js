import React, { Component } from 'react';
import { Query, Redirect } from 'src/drivers';
import { bool, func, object, shape, string } from 'prop-types';
import gql from 'graphql-tag';

import { setCurrentPage, setPrevPageTotal } from 'src/actions/catalog';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classify from 'src/classify';
import Icon from 'src/components/Icon';
import getQueryParameterValue from 'src/util/getQueryParameterValue';
import CloseIcon from 'react-feather/dist/icons/x';
import Skeleton from 'react-loading-skeleton';
import ProductSearch from './productSearch';
import defaultClasses from './search.css';
import PRODUCT_SEARCH from '../../queries/productSearch.graphql';
import WishlistSidebar from 'src/components/Account/Wishlist/sidebar';
import CompareSidebar from 'src/components/CompareList/sidebar';
import Breadcrumbs from 'src/components/Breadcrumbs';
import Gallery from 'src/components/Gallery';
const getCategoryName = gql`
    query getCategoryName($id: Int!) {
        category(id: $id) {
            name
        }
    }
`;
const pageSize = 4;
const emptyData = Array.from({ length: pageSize }).fill(null);
export class Search extends Component {
    static propTypes = {
        classes: shape({
            noResult: string,
            root: string,
            totalPages: string
        }),
        executeSearch: func.isRequired,
        history: object,
        location: object.isRequired,
        match: object,
        searchOpen: bool,
        toggleSearch: func
    };

    componentDidMount() {
        document.title = 'Search';
        window.scrollTo(0, 0);
        // Ensure that search is open when the user lands on the search page.
        const { location, searchOpen, toggleSearch } = this.props;

        const inputText = getQueryParameterValue({
            location,
            queryParameter: 'query'
        });

        if (toggleSearch && !searchOpen && inputText) {
            toggleSearch();
        }
    }

    getCategoryName = (categoryId, classes) => (
        <div className={classes.categoryFilters}>
            <button
                className={classes.categoryFilter}
                onClick={this.handleClearCategoryFilter}
            >
                <small className={classes.categoryFilterText}>
                    <Query
                        query={getCategoryName}
                        variables={{ id: categoryId }}
                    >
                        {({ loading, error, data }) => {
                            if (error) return null;
                            if (loading) return '';
                            return data.category.name;
                        }}
                    </Query>
                </small>
                <Icon
                    src={CloseIcon}
                    attrs={{
                        width: '13px',
                        height: '13px'
                    }}
                />
            </button>
        </div>
    );

    handleClearCategoryFilter = () => {
        const inputText = getQueryParameterValue({
            location: this.props.location,
            queryParameter: 'query'
        });

        if (inputText) {
            this.props.executeSearch(inputText, this.props.history);
        }
    };

    get sidebar() {
        const { classes } = this.props;

        return <div className={classes.searchSidebar}>
            <div className={classes.sidebarBlocks}>
                <WishlistSidebar />
                <CompareSidebar />
            </div>
        </div>
    }

    render() {
        const { 
            classes, 
            location, 
            currentPage,
            pageSize,
            prevPageTotal,
            setCurrentPage,
            setPrevPageTotal, 
        } = this.props;

        const pageControl = {
            currentPage: currentPage,
            setPage: setCurrentPage,
            updateTotalPages: setPrevPageTotal,
            totalPages: prevPageTotal
        };

        const { getCategoryName } = this;

        const inputText = getQueryParameterValue({
            location,
            queryParameter: 'query'
        });
        const categoryId = getQueryParameterValue({
            location,
            queryParameter: 'category'
        });

        if (!inputText) {
            return <Redirect to="/" />;
        }

        let queryVariable = categoryId
            ? { inputText, categoryId }
            : { 
                inputText, 
                pageSize: Number(pageSize),
                currentPage: Number(currentPage),
            };

        return (
            <Query query={PRODUCT_SEARCH} variables={queryVariable}>
                {({ loading, error, data }) => {
                    if (error) return null;
                    if (loading) return <div className={classes.searchPage}><div className={classes.root}><Skeleton height='300px' width='100%' /><Gallery layout="fourItems" pageSize={pageSize} data={emptyData} /></div></div>;
                    
                    const pageCount =
                        data.products.total_count / pageSize;
                    const totalPages = Math.ceil(pageCount);
                    const totalWrapper = {
                        ...pageControl,
                        totalPages: totalPages
                    };
                    
                    return (
                        <div className={classes.searchPage}>
                            <Breadcrumbs />
                            <article className={classes.root}>
                                {this.sidebar}
                                <div className={classes.searchContent}>
                                    {data.products.items.length === 0
                                        ? <div className={classes.noResult}>
                                            No results found!
                                        </div>
                                        : 
                                        <div className={classes.hasResult}>
                                            <div className={classes.categoryTop}>
                                                <h2 className={classes.resultTitle}>Search results for '{inputText}'</h2>
                                                <div className={classes.totalPages}>
                                                There are {data.products.total_count} items{' '}
                                                </div>
                                                {categoryId &&
                                                    getCategoryName(categoryId, classes)}
                                            </div>
                                            <ProductSearch data={data} pageSize={pageSize} pageControl={totalWrapper} />
                                        </div>
                                    }
                                </div>
                            </article>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

const mapStateToProps = ({ catalog }) => {
    return {
        currentPage: catalog.currentPage,
        pageSize: catalog.pageSize,
        prevPageTotal: catalog.prevPageTotal
    };
};
const mapDispatchToProps = {
    setCurrentPage,
    setPrevPageTotal
};
export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Search);
