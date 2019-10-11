import React, { Component } from 'react';
import classify from 'src/classify';
import { string, shape } from 'prop-types';
import { Query } from 'src/drivers';
import gql from 'graphql-tag';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import getUrlKey from 'src/util/getUrlKey';
import { resourceUrl } from 'src/drivers';
import Gallery from 'src/components/Gallery';
import defaultClasses from './cms.css';
import Slider from "react-slick";
import 'src/components/ImageCarousel/slick/slick.scss';
import 'src/components/ImageCarousel/slick/slicktheme.scss';
import './cmsPage.scss';

import Breadcrumbs from 'src/components/Breadcrumbs';
import Skeleton from 'react-loading-skeleton';

const pageSize = 5;
const emptyData = Array.from({ length: pageSize }).fill(null);

import queryProduct from 'src/queries/getProductList.graphql';
import queryCms from 'src/queries/getCmsPage.graphql';

const queryBanner = gql`
    query banners {
        banners {
            id
            title
            image
            url
            description
        }
    }
`;

class CMS extends Component {
    static propTypes = {
        classes: shape({
            mainContent: string,
            mainContentHome: string,
            bannerHome: string,
            bannerWrapper: string,
            bannerHomeContent: string,
            textContent: string,
            bannerItem: string,
            emoji: string,
            bannerHomeButton: string,
            imageCarousel: string,
            newProductList: string,
            newProductTitle: string,
            featuredProductList: string,
            featuredProductTitle: string,
            bestsellerProductList: string,
            bestsellerProductTitle: string
        })
    };

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        console.log(error);
        console.log(info);
    }

    get homeBanners() {
        const { classes } = this.props;
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };
        return (
            <Query
                query={queryBanner}
            >
                {({ loading, error, data }) => {
                    if (error) return null;
                    if (loading) return null;

                    const listItems = data.banners.map((banner) =>
                        <div key={banner.id}>{this.renderImage(banner.image)}</div>
                    );

                    return (
                        <div>
                            <section className={classes.bannerWrapper}>
                                {/* <Slider {...settings}>
                                    {listItems}
                                </Slider> */}
                                <div></div>
                                <video  loop autoplay='true' muted>
                                    <source src='https://truclothing.com/pub/media/wysiwyg/truclothing_peaky-blinders-promo-video.mp4' type="video/mp4" />
                                </video>
                                
                            </section>
                            <section className={classes.bannerHome}>
                                <div className={classes.bannerItem} >
                                    <div className={classes.bannerHomeContent}>
                                        <div className={classes.textContent} >
                                            <h2 >DRESS LIKE <br></br>
                                                <b>A BLINDER<span className={classes.emoji}></span></b>
                                            </h2>
                                            <p>New styles available in the <b>PEAKY BLINDERS</b> section</p>
                                            <a className={classes.bannerHomeButton} href="#">SHOP NOW</a>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    );
                }}
            </Query>
        );
    }

    get listProducts() {
        const { classes } = this.props;

        return (
            <Query
                query={queryProduct}
                variables={{ type: 'cms' }}
            >
                {({ loading, error, data }) => {
                    if (error) return null;
                    if (loading) {
                        return (
                            <div>
                                <section className={classes.newProductList}>
                                    <h2 className={classes.newProductTitle}>
                                        <Skeleton />
                                    </h2>
                                    <Gallery layout="homeItems" pageSize={pageSize} data={emptyData} />
                                </section>
                                <section className={classes.newProductList}>
                                    <h2 className={classes.newProductTitle}>
                                        <Skeleton />
                                    </h2>
                                    <Gallery layout="homeItems" pageSize={pageSize} data={emptyData} />
                                </section>
                            </div>
                        )
                    }

                    const hasNew = !!(data.products_list.new_items && data.products_list.new_items.length);
                    const hasFeature = !!(data.products_list.featured_items && data.products_list.featured_items.length);
                    const hasBestseller = !!(data.products_list.bestseller_items && data.products_list.bestseller_items.length);

                    return (
                        <div>
                            {
                                hasNew &&
                                <section className={classes.newProductList}>
                                    <h2 className={classes.newProductTitle}>
                                        <strong>New Products</strong>
                                    </h2>
                                    <Gallery layout="homeItems" data={data.products_list.new_items} />
                                </section>
                            }
                            {
                                hasFeature && 
                                <section className={classes.newProductList}>
                                    <h2 className={classes.newProductTitle}>
                                        <strong>Featured Products</strong>
                                    </h2>
                                    <Gallery layout="homeItems" data={data.products_list.featured_items} />
                                </section>
                            }
                            {
                                hasFeature && 
                                <section className={classes.newProductList}>
                                    <h2 className={classes.newProductTitle}>
                                        <strong>Bestseller Products</strong>
                                    </h2>
                                    <Gallery layout="homeItems" data={data.products_list.bestseller_items} />
                                </section>
                            }
                        </div>
                    )
                }}
            </Query>
        );
    }

    get cmsPage() {
        const { classes, id } = this.props;

        return (
            <Query
                query={queryCms}
                variables={{ id: id, onServer: true}}
            >
                {({ loading, data }) => {
                    if (loading) return loadingIndicator;

                    if (data && data.cmsPage && data.cmsPage.title) {
                        document.title = data.cmsPage.title;
                    }

                    let __html = data ? data.cmsPage.content : null;

                    return (
                        <div
                            className={classes.root}
                            dangerouslySetInnerHTML={{ __html }}
                        />
                    )
                }}
            </Query>
        );
    }

    render() {
        const { classes } = this.props;
        const { cmsPage, homeBanners, listProducts } = this;
        const urlKey = getUrlKey();

        let pageTitle = urlKey ? document.title : 'Home Page';

        if (urlKey) {
            return (
                <div className={classes.cmsContent}>
                    <div className={classes.mainContent}>
                        <Breadcrumbs />
                        <h1>{pageTitle}</h1>
                        <div className={classes.info}>
                            {cmsPage}
                        </div>
                    </div>
                </div>
            );
        }

        document.title = pageTitle;

        return (
            <div className={classes.mainContentHome}>
                {homeBanners}
                {/* {listProducts} */}
            </div>
        );
    }

    /**
     * TODO: Product images are currently broken and pending a fix from the `graphql-ce` project
     * https://github.com/magento/graphql-ce/issues/88
     */
    renderImage = (img) => {
        return (
            <img
                src={resourceUrl(img, {
                    type: 'image-banner',
                    width: 1240
                })}
                alt={''}
            />
        );
    };
}

export default classify(defaultClasses)(CMS);
