import React, { Component, Suspense, Fragment } from 'react';
import { Form } from 'informed';
import classify from 'src/classify';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import chevronUpIcon from 'react-feather/dist/icons/chevron-up';
import chevronDownIcon from 'react-feather/dist/icons/chevron-down';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import Carousel from 'src/components/ProductImageCarousel';
import RichText from 'src/components/RichText';
import defaultClasses from './productFullDetail.css';
import Tabs from 'src/components/Tabs';
import Gallery from 'src/components/Gallery';
import Review from 'src/components/ProductReview';
import MoreInformation from 'src/components/MoreInformation';
import ProductAction from './Actions';
import Modal from 'react-animated-modal';
import ShareForm from 'src/components/shareProduct';
import { compose } from 'redux';
import { connect } from 'src/drivers';
import globalClasses from 'src/index.css';
import ProductPrice from 'src/components/ProductPrice';
import Feature from 'src/components/Feature';
import { addItemToCart } from 'src/actions/cart';
import { togglePopup } from 'src/actions/app';
import { openSharePopup } from 'src/actions/catalog';
import Related from 'src/components/Related';
import Breadcrumbs from 'src/components/Breadcrumbs';
import { createLoadingSelector } from '../../selectors/loading';
import { withRouter } from 'react-router-dom';
import mockData from 'src/components/Related/mockData';
import ProductSizeChart from 'src/components/ProductSizeChart/ProductSizeChart';
const iconAttrs = {
    width: 14
};

import appendOptionsToPayload from 'src/util/appendOptionsToPayload';

const Options = React.lazy(() => import('../ProductOptions'));

import PlaceHolderImage from './place_1.svg';
import { toast } from 'react-toastify';

class ProductFullDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dirty: false,
            autocompleteVisible: false,
            optionCodes: new Map(),
            optionSelections: new Map(),
            quantity: 1,
            rating: 4,
            selectedIndex: null
        };
        this.myRef = null;
    }
    componentDidMount() {
        const oauthScript = document.createElement('script');
        oauthScript.src =
            'https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-55d6907796e30f69';

        document.body.appendChild(oauthScript);
    }
    static getDerivedStateFromProps(props, state) {
        const { configurable_options } = props.product;
        const optionCodes = new Map(state.optionCodes);

        // if this is a simple product, do nothing
        if (!Array.isArray(configurable_options)) {
            return null;
        }

        // otherwise, cache attribute codes to avoid lookup cost later
        for (const option of configurable_options) {
            optionCodes.set(option.attribute_id, option.attribute_code);
        }

        return { optionCodes };
    }

    setQuantity = quantity => this.setState({ quantity });

    addToCart = () => {
        const { props, state } = this;
        const { optionSelections, quantity, optionCodes } = state;
        const { addItemToCart, product, history, redirect_to_cart } = props;
        const { configurable_options } = product;
        const isConfigurable = Array.isArray(configurable_options);
        const productType = isConfigurable
            ? 'ConfigurableProduct'
            : 'SimpleProduct';

        const payload = {
            item: product,
            productType,
            quantity
        };

        if (productType === 'ConfigurableProduct') {
            appendOptionsToPayload(payload, optionSelections, optionCodes);
        }

        addItemToCart(payload).then(() => {
            redirect_to_cart && history.push('/cart.html');
        });
    };

    handleSelectionChange = (optionId, selection) => {
        this.setState(({ optionSelections }) => ({
            optionSelections: new Map(optionSelections).set(
                optionId,
                Array.from(selection).pop()
            )
        }));
    };

    get fallback() {
        return loadingIndicator;
    }

    get productOptions() {
        const { fallback, handleSelectionChange, props } = this;
        const { configurable_options } = props.product;
        const isConfigurable = Array.isArray(configurable_options);

        if (!isConfigurable) {
            return null;
        }

        return (
            <Suspense fallback={fallback}>
                <Options
                    options={configurable_options}
                    onSelectionChange={handleSelectionChange}
                />
            </Suspense>
        );
    }

    increaseQty = () => {
        this.setState({
            quantity: parseInt(this.state.quantity) + 1
        });
    };

    decreaseQty = () => {
        if (this.state.quantity > 1) {
            this.setState({
                quantity: parseInt(this.state.quantity) - 1
            });
        }
    };

    openReview = () => {
        this.setState({
            selectedIndex: 2
        });
        window.scroll({
            top: this.myRef.offsetTop,
            left: 0,
            behavior: 'smooth'
        });
    };

    onChangeQuantityInput = newQty => {
        console.log('New qty: ' + newQty);
    };

    get isMissingOptions() {
        const { product } = this.props;
        const { __typename } = product;
        if (__typename != 'ConfigurableProduct') {
            return false;
        }
        const { configurable_options } = product;
        const numProductOptions = configurable_options.length;
        const numProductSelections = this.state.optionSelections.size;

        return numProductSelections < numProductOptions;
    }

    hideSharePopup = () => {
        const { modalIsOpen } = globalClasses;
        const bodyClasses = document.querySelector('body').classList;
        this.props.openSharePopup(false);
        bodyClasses.remove(modalIsOpen);
    };

    get formSharePopup() {
        const { classes, product, isPopupShareOpen } = this.props;
        return (
            <Modal
                visible={isPopupShareOpen}
                closemodal={this.hideSharePopup}
                type="slideInUp"
            >
                <div className={classes.popupWrapper}>
                    <div className={classes.popupContent}>
                        <ShareForm product={product} />
                    </div>
                </div>
            </Modal>
        );
    }

    get galleryImage() {
        const { media_gallery_entries, small_image, name } = this.props.product;

        if (
            Array.isArray(media_gallery_entries) &&
            media_gallery_entries.length > 0
        ) {
            return <Carousel images={media_gallery_entries} />;
        }

        const src =
            small_image && small_image.url ? small_image.url : PlaceHolderImage;
        return <img alt={name} src={src} />;
    }

    render() {
        const { productOptions, props, isMissingOptions } = this;
        const {
            classes,
            product,
            isSignedIn,
            togglePopup,
            isFetching,
            display_product_stock_status,
            catalog_review_active,
            productalert_allow_stock
        } = props;

        const { review, related, attributes } = product;
        const { rating_summary, reviews_count } = review;
        const reviews = review.items;

        const countReview = !reviews || !reviews.length ? 0 : reviews.length;
        const reviewLabel = !countReview
            ? 'Review'
            : 'Review(' + countReview + ')';

        const ratingSummaryStyle = {
            width: rating_summary + '%'
        };
        const {
            estimatedDeliveryBox,
            estimatedDelivery,
            estimatedContent,
            estimatedBox,
            priceEs,
            estimatedTitle,
            estimatedPrice,
            productMain,
            featureProductMain
        } = defaultClasses;
        return (
            <div className={productMain}>
                {isFetching && (
                    <div className={classes.loading}>{loadingIndicator}</div>
                )}
                {this.formSharePopup}
                <Breadcrumbs />
                <Form className={classes.root}>
                    <div className={classes.productViewInfoTop}>
                        
                        <div className={classes.productViewInfoMain}>
                            <section className={featureProductMain}>
                                <Feature customClass="featureProduct" />
                            </section>
                            <section className={classes.imageCarousel}>
                                {this.galleryImage}
                            </section>
                            <section className={classes.title}>
                                <h1 className={classes.productName}>
                                    <span>{product.name}</span>
                                </h1>
                                {/* {catalog_review_active &&
                                    <div className={classes.reviewInfo}>
                                        {reviews_count > 0
                                            ? <div className={classes.ratingSummary}>
                                                <div className={classes.ratingResult} style={ratingSummaryStyle}>
                                                </div>
                                            </div>
                                            : null
                                        }
                                        <div className={classes.reviewActions}>
                                            {reviews_count > 0
                                                ? (<Fragment>
                                                    <span>{reviews_count} {' Review(s) '}</span>
                                                    <span className={classes.separator}>|</span>
                                                    <button
                                                        type="button"
                                                        className={classes.addReviewLink}
                                                        onClick={this.openReview}
                                                    >
                                                        {'Add your review'}
                                                    </button>
                                                </Fragment>)
                                                : <button
                                                    type="button"
                                                    className={classes.addReviewLink}
                                                    onClick={this.openReview}
                                                >
                                                    {'Be the first to review this product'}
                                                </button>
                                            }
                                        </div>
                                    </div>
                                } */}
                                {product.short_description && (
                                    <div
                                        className={
                                            classes.productShortDescription
                                        }
                                    >
                                        {product.short_description}
                                    </div>
                                )}
                                <div className={classes.productStockSku}>
                                    {display_product_stock_status && (
                                        <span className={classes.productStatus}>
                                            <span className={classes.label}>
                                                Availability:{' '}
                                                {product.is_available
                                                    ? 'In stock'
                                                    : 'Out of stock'}
                                            </span>
                                        </span>
                                    )}
                                    <span className={classes.productSku}>
                                        <span className={classes.label}>
                                            SKU#: {product.sku}
                                        </span>
                                    </span>
                                </div>
                                <ProductPrice
                                    layout="category"
                                    product={product}
                                />
                            </section>

                            <section className={estimatedDeliveryBox}>
                                <div className={estimatedDelivery}>
                                    <div className={estimatedContent}>
                                        <div className={estimatedBox}>
                                            <p className={priceEs}>
                                                <strong
                                                    className={estimatedTitle}
                                                >
                                                    Estimated Shipping Date
                                                </strong>
                                                <span
                                                    className={estimatedPrice}
                                                >
                                                    27/09/2019
                                                </span>
                                            </p>
                                        </div>
                                        <div className={estimatedBox}>
                                            <p className={priceEs}>
                                                <strong
                                                    className={estimatedTitle}
                                                >
                                                    Estimated Delivery Date
                                                </strong>
                                                <span
                                                    className={estimatedPrice}
                                                >
                                                    30/09/2019 - 02/10/2019
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className={classes.options}>
                                {productOptions}
                            </section>
                            <section className={classes.sizeChartWrapper}>
                                <ProductSizeChart   />              
                            </section>
                            <section className={classes.cartActions}>
                                <div className={classes.quantity}>
                                    {/* <h2 className={classes.quantityTitle}>
                                            <span>Qty</span>
                                        </h2> */}
                                    <div className={classes.quantityWrapper}>
                                        <div
                                            className={classes.qtyUpdateWrapper}
                                        >
                                            <button
                                                type="button"
                                                className={
                                                    classes.qtyUpdateDesc
                                                }
                                                onClick={this.decreaseQty}
                                            >
                                                <span>-</span>
                                            </button>
                                            <div className={classes.qtyInput}>
                                                <input
                                                    name="qty"
                                                    id="qty"
                                                    onChange={
                                                        this
                                                            .onChangeQuantityInput
                                                    }
                                                    value={this.state.quantity}
                                                    title="Qty"
                                                    className={
                                                        classes.qtyInputText
                                                    }
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                className={classes.qtyUpdateInc}
                                                onClick={this.increaseQty}
                                            >
                                                <span>+</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {product.is_available ? (
                                    <Button
                                        priority="high"
                                        onClick={this.addToCart}
                                        disabled={
                                            isFetching || isMissingOptions
                                        }
                                        classCustom="btnAddToCartProduct"
                                    >
                                        <span>Add to Cart</span>
                                    </Button>
                                ) : (
                                    <Button disabled priority="high">
                                        <span>Out of Stock</span>
                                    </Button>
                                )}
                            </section>
                            <section className={classes.addThis}>
                                <div className="addthis_inline_share_toolbox"></div>
                            </section>

                            {productalert_allow_stock &&
                                isSignedIn &&
                                !product.is_available && (
                                    <button
                                        type="button"
                                        className={classes.alertStock}
                                        onClick={this.alertStock}
                                    >
                                        {
                                            'Notify me when this product is in stock'
                                        }
                                    </button>
                                )}
                            {/* <ProductAction
                                product={product}
                                togglePopup={togglePopup}
                                isSignedIn={isSignedIn}
                                optionSelections={this.state.optionSelections}
                            /> */}
                        </div>
                    </div>
                    <div className={classes.productRelatedWraper}>
                        {related && related.length > 0 ? (
                            <Related items={mockData} />
                        ) : null}
                    </div>
                </Form>

                <div className={classes.rootTabs}>
                    <div className={classes.productViewDetailed}>
                        <div
                            ref={ref => (this.myRef = ref)}
                            className={classes.productViewTabs}
                        >
                            <Tabs selectedTabIndex={this.state.selectedIndex}>
                                <div label="Details">
                                    <section className={classes.description}>
                                        <RichText
                                            content={product.description}
                                        />
                                    </section>
                                </div>
                                <div label="More Information">
                                    <MoreInformation attributes={attributes} />
                                </div>
                                {catalog_review_active && (
                                    <div label={reviewLabel}>
                                        <Review product={product} />
                                    </div>
                                )}
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    alertStock = () => {
        toast.success('Alert subscription has been saved.');
    };
}

const requests = [
    'CART/ADD_ITEM/',
    'CART/GET_CART_DATA/',
    'CATALOG/ADD_REVIEW/'
];

const loadingSelector = createLoadingSelector(requests);

const mapStateToProps = ({ user, loading, catalog }) => {
    const { isSignedIn } = user;
    const {
        display_product_stock_status,
        catalog_review_active,
        catalog_review_allow_guest,
        redirect_to_cart,
        productalert_allow_stock
    } = catalog.storeConfig;
    return {
        isSignedIn,
        display_product_stock_status,
        catalog_review_active,
        catalog_review_allow_guest,
        redirect_to_cart,
        productalert_allow_stock,
        isFetching: loadingSelector(loading),
        isPopupShareOpen: catalog.isPopupShareOpen
    };
};

const mapDispatchToProps = {
    openSharePopup,
    addItemToCart,
    togglePopup
};

export default compose(
    withRouter,
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ProductFullDetail);
