import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import Gallery from 'src/components/Gallery';
import Pagination from 'src/components/Pagination';
import FilterModal from './FilterModal';
import SortBy from './SortBy';
import Limiter from './Limiter';
import defaultClasses from './category.css';
import Icon from 'src/components/Icon';
import gridIcon from 'react-feather/dist/icons/grid';
import listIcon from 'react-feather/dist/icons/list';
import filterIcon from 'react-feather/dist/icons/filter';
import EmptyCategory from './emptyCategory';
import BestSellers from 'src/components/BestSellers'
import Breadcrumbs from 'src/components/Breadcrumbs';
import mockData from 'src/components/BestSellers/mockData';
import ShowMoreText from 'src/components/ShowMoreText';
import Feature from 'src/components/Feature';

const iconAttrs = {
    width: 20
};

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
            displayMode: 'grid',
            filterModalOpen: false,
            windowWidth: window.innerWidth
        };
    }

    toggleDisplayMode = () => {
        this.state.displayMode == 'grid'
            ? this.setState({ displayMode: 'list' })
            : this.setState({ displayMode: 'grid' });
    };
    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentDidMount() {
        const { data, filterLayer, updateOriginFilterOptions } = this.props;
        if (!filterLayer)
            updateOriginFilterOptions({
                categoryId: data.category.id,
                filterOptions: data.category.filters.items,
            });

        if (this.state.windowWidth > 767) {
            this.setState({ filterModalOpen: true });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange = () => {
        this.setState({ windowWidth: window.innerWidth });
        if (this.state.windowWidth > 767) {
            this.setState({ filterModalOpen: true });
        } else {
            this.setState({ filterModalOpen: false });
        }
    };

    get filterModal() {
        const { filters, categoryId, data } = this.props;
        const displayMode = data && data.category ? data.category.display_mode : null;
        const isShowContent = !displayMode || displayMode == 'PRODUCTS';

        return this.state.filterModalOpen && isShowContent ? (
            <FilterModal categoryId={categoryId} filters={filters} closeModalHandler={this.filterModalSwitcher} />
        ) : null;
    }

    filterModalSwitcher = () => {
        this.setState({ filterModalOpen: !this.state.filterModalOpen });
    };

    get categoryOverview() {
        const { classes, data } = this.props;
        const title = data ? data.category.name : null;
        const description = data ? data.category.description : null;
        const image = data && data.category.image != 'false' ? data.category.image : null;

        return <div className={classes.categoryOverview}>
            { 
                image != null &&
                <h1 className={classes.title}>
                {/* TODO: Switch to RichContent component from Peregrine when merged */}
                <div
                        dangerouslySetInnerHTML={{
                            __html: title
                        }}
                    /> 
                </h1>
            }
            
            {
                image &&
                <img
                    className={classes.categoryImage}
                    src={image}
                    alt={title}
                    title={title}
                />
            }   
            {/* Feature Container */}
            <Feature />
            {/* Best Sellers */}
            <BestSellers items={mockData}/>
            {/* categoryDescription */}    
            
            <ShowMoreText
                lines={3}
                more='Show more'
                less='Show less'
                anchorClass=''
                onClick={this.executeOnClick}
                expanded={false}
            >
            <div
                className={classes.categoryDescription}
                dangerouslySetInnerHTML={{
                    __html: description
                }}
            />
            </ShowMoreText>
            
        </div>
    }

    get sidebar() {
        const { classes } = this.props;

        return <div className={classes.categorySidebar}>
            {this.filterModal}
            <div className={classes.sidebarBlocks}>
                {/* <WishlistSidebar />
                <CompareSidebar /> */}
            </div>
        </div>
    }

    get categoryPageContent() {
        const { classes, pageControl, data, pageSize, sortByControl, limiterControl } = this.props;
        const items = data ? data.category.products.items : null;
        const filters = data ? data.category.filters.items : null;
        const hasItems = !!(Array.isArray(items) && items.length);
        const hasFilter = !!(Array.isArray(filters) && filters.length);
        const title = data ? data.category.name : null;
        const options = [
            {
                label: "Position",
                value: "position"
            },
            {
                label: "Price",
                value: "price"
            },
            {
                label: "Product Name",
                value: "name"
            }
        ];
        const displayMode = data && data.category ? data.category.display_mode : null;
        const isShowContent = !displayMode || displayMode == 'PRODUCTS';

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

        const gridModeClass = this.state.displayMode == 'grid' ? classes.gridModeActive : classes.gridMode;
        const listModeClass = this.state.displayMode == 'list' ? classes.listModeActive : classes.listMode;

        const galleryLayout = this.state.displayMode == 'grid' ? 'fourItems' : 'listLayout';
        const layoutPage = 'category';

        return (
            <div className={classes.categoryMainContent}>
                {this.categoryOverview}
                {isShowContent &&
                    <div className={classes.productList}>
                        {hasFilter &&
                            <div className={classes.filterOptions}>
                                <div className={classes.headerButtons}>
                                    <button
                                        onClick={this.filterModalSwitcher}
                                        className={classes.filterButton}
                                    >
                                        <spam className={classes.iconFilterButton}></spam>
                                    </button>
                                </div>

                            </div>
                        }
                        {hasItems
                            ? <Fragment>
                                <div className={classes.displayMode}>
                                    <SortBy
                                        field="sortBy"
                                        fieldState="position"
                                        items={options}
                                        sortByControl={sortByControl}
                                    />
                                    <Limiter
                                        field="limiter"
                                        items={limitOptions}
                                        limiterControl={limiterControl}
                                    />
                                </div>
                               
                                <section className={classes.gallery}>
                                    <Gallery
                                        className={classes.categoryProducts}
                                        data={items}
                                        title={title}
                                        layout={galleryLayout}
                                        pageSize={pageSize}
                                        layoutCustom={layoutPage}
                                    />
                                </section>
                                <div className={classes.pagination}>
                                    <Limiter
                                        field="limiter"
                                        items={limitOptions}
                                        limiterControl={limiterControl}
                                        position='bottom'
                                    />
                                    <Pagination pageControl={pageControl} />
                                </div>
                            </Fragment>
                            : <EmptyCategory />
                        }
                    </div>
                }
            </div>
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Breadcrumbs />
                <article className={classes.root}>
                
                    <div className={classes.categoryPageContent}>
                        {this.categoryPageContent}
                        {this.sidebar}
                    </div>
                </article>
            </div>
        );
    }
}

export default classify(defaultClasses)(CategoryContent);
