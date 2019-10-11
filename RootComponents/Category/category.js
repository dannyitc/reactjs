import React, { Component } from 'react';
import { string, number, shape } from 'prop-types';
import { Query } from 'react-apollo';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classify from 'src/classify';
import {
    setCurrentPage,
    setPrevPageTotal,
    setLimit,
    setCurrentSortBy,
    setCurrentDirection,
    updateOriginFilterOptions,
    updateCurrentFilterOptions,
    setCategoryData,
    updateChosenFilterOptions
} from 'src/actions/catalog';
import CategoryContent from './categoryContent';
import CategorySkeleton from './categorySkeleton';
import defaultClasses from './category.css';
import categoryQuery from 'src/queries/getCategory.graphql';

class Category extends Component {
    static propTypes = {
        id: number,
        classes: shape({
            gallery: string,
            root: string,
            title: string
        }),
        currentPage: number,
        pageSize: number,
        prevPageTotal: number
    };

    // TODO: Should not be a default here, we just don't have
    // the wiring in place to map route info down the tree (yet)
    static defaultProps = {
        id: 3
    };

    componentWillMount() {
        this.props.setCategoryData(this.props.id);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.updateChosenFilterOptions([]);
    }

    componentWillUnmount() {
        this.props.setCategoryData(null);
    }

    componentDidUpdate(prevProps) {
        if (this.props.currentPage !== prevProps.currentPage) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        const {
            id,
            classes,
            currentPage,
            pageSize,
            prevPageTotal,
            setCurrentPage,
            setPrevPageTotal,
            setLimit,
            currentSortBy,
            setCurrentSortBy,
            setCurrentDirection,
            currentDirection,
            updateOriginFilterOptions,
            updateCurrentFilterOptions,
            originFilterOptions,
            chosenFilterOptions
        } = this.props;

        const pageControl = {
            currentPage: currentPage,
            setPage: setCurrentPage,
            updateTotalPages: setPrevPageTotal,
            totalPages: prevPageTotal
        };

        const sortByControl = {
            currentSortBy: currentSortBy,
            setSortBy: setCurrentSortBy,
            currentDirection: currentDirection,
            setDirection: setCurrentDirection
        };

        const limitOptions = [
            {
                label: "8",
                value: 8
            },
            {
                label: "12",
                value: 12
            },
            {
                label: "16",
                value: 16
            }
        ];

        const limiterControl = {
            currentLimit: pageSize,
            limitOptions: limitOptions,
            setLimit: setLimit
        };

        let productSortInput = {};
        productSortInput[currentSortBy] = currentDirection;

        let variables = {
            id: Number(id),
            pageSize: Number(pageSize),
            currentPage: Number(currentPage),
            sort: productSortInput
        };

        const filterLayer = chosenFilterOptions && chosenFilterOptions.length? chosenFilterOptions.map(option => Object.assign({},
            {
                code: option.code,
                value: option.value
            }))
            : null;

        variables.filterLayer = filterLayer;
        return (
            <Query
                query={categoryQuery}
                variables={variables}
            >
                {({ loading, error, data }) => {
                    if (error && (!data || !data.category)) return null;
                    if (loading)
                        return <CategorySkeleton />;

                    const pageCount = data.category.products.total_count / pageSize;
                    const totalPages = Math.ceil(pageCount);
                    const totalWrapper = {
                        ...pageControl,
                        totalPages: totalPages
                    };

                    document.title = data.category.name;

                    return (
                        <CategoryContent
                            classes={classes}
                            pageControl={totalWrapper}
                            sortByControl={sortByControl}
                            limiterControl={limiterControl}
                            filters={data.category.filters.items}
                            categoryId={data.category.id}
                            data={data}
                            updateOriginFilterOptions={updateOriginFilterOptions}
                            updateCurrentFilterOptions={updateCurrentFilterOptions}
                            filterLayer={filterLayer}
                            originFilterOptions={originFilterOptions}
                        />
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
        prevPageTotal: catalog.prevPageTotal,
        currentLimit: catalog.pageSize,
        currentSortBy: catalog.currentSortBy,
        currentDirection: catalog.currentDirection,
        chosenFilterOptions: catalog.chosenFilterOptions,
        originFilterOptions: catalog.originFilterOptions
    };
};
const mapDispatchToProps = {
    setCurrentPage,
    setPrevPageTotal,
    setLimit,
    setCurrentSortBy,
    setCurrentDirection,
    updateOriginFilterOptions,
    updateCurrentFilterOptions,
    setCategoryData,
    updateChosenFilterOptions
};

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Category);
