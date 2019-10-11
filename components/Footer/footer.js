import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classify from 'src/classify';
import defaultClasses from './footer.css';
import globalClasses from 'src/index.css';
import Icon from 'src/components/Icon';
import arrowUpIcon from 'react-feather/dist/icons/arrow-up';
import { Link } from 'react-router-dom';
import Contact from 'src/components/Contact';
import PaymentIcon from './payment-icon.svg';
import Newsletter from 'src/components/Newsletter';
import Modal from "react-animated-modal";
import { withRouter } from 'react-router-dom';

const iconAttrs = {
    width: 20
};

class Footer extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            copyright: PropTypes.string,
            root: PropTypes.string,
            tile: PropTypes.string,
            tileBody: PropTypes.string,
            tileTitle: PropTypes.string,
            footerLinkWrap: PropTypes.string,
            footerLink: PropTypes.string,
            footerTop: PropTypes.string,
            customBlock: PropTypes.string,
            blockNine: PropTypes.string,
            blockThree: PropTypes.string,
            blockTitle: PropTypes.string,
            blockContent: PropTypes.string,
            contactInfo: PropTypes.string,
            container: PropTypes.string,
            blockFour: PropTypes.string,
            blockEight: PropTypes.string,
            blockSix: PropTypes.string,
            links: PropTypes.string,
            blockEight: PropTypes.string,
            blockFour: PropTypes.string,
            features: PropTypes.string,
            footerMiddle: PropTypes.string,
            blockMiddleContent: PropTypes.string,
            textOrange: PropTypes.string,
            footerBotoom: PropTypes.string,
            footerBotoomContainer: PropTypes.string,
            subcribe: PropTypes.string,
            newsletter: PropTypes.string,
            blockPaymnent: PropTypes.string,
        })
    };

    constructor() {
        super();
        this.state = {
            isPopupContactOpen: false
        };
    }

    backToTop = () => {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    };

    showContactPopup = () => {
        this.setState(() => ({
            isPopupContactOpen: true
        }));
    };

    hideContactPopup = () => {
        this.setState(() => ({
            isPopupContactOpen: false
        }));
    };

    get contactPopup() {
        const {
            classes
        } = this.props;
        const { isPopupContactOpen } = this.state;
        return (
            <Modal visible={isPopupContactOpen} closemodal={this.hideContactPopup} type="slideInUp">
                <div className={classes.popupWrapper}>
                    <div className={classes.popupContent}>
                        <Contact onClose={this.hideContactPopup} />
                    </div>
                </div>
            </Modal>
        );
    }

    render() {
        const { classes, location } = this.props;
        const { pageContainer } = globalClasses;
        if (location.pathname == '/') {
            return null;
        }
        return (
            <footer className={classes.root}>
                <div className={classes.footerTop}>
                    <div className={classes.container}>
                        <div className={classes.customBlock}>
                            <div className={classes.blockNine}>
                                <div className={classes.blockTitle}><strong><span>About Us</span></strong></div>
                                <div className={classes.blockContent}>
                                    <p>At TruClothing keeping our customers happy is always our number 1 priority we do this by
                                        striving for perfection in everything we do from selecting the vast range of products we
                                        have, keeping up with the latest trends, ensuring the quality is second to none and
                                        providing all this at low prices all year round. <br></br>
                                        All our pictures are taken in house never glossed or filtered so what you see is what
                                        you get! We believe this is vital for our customers to get a true understating of our
                                        products. <br></br>
                                        We have a no quibble return policy with FREE DELIVERY &amp; RETURNS for all orders over
                                        £50 (UK Mainland only). <br></br>
                                        We at TruClothing love speaking with our customers whether it is to help with sizing,
                                        returns or even advice as to what to wear for occasions such as proms, weddings, work, a
                                        night out or even your first date! We are available on the phone, e-mail or live chat.
                                    </p>
                                </div>
                            </div>
                            <div className={classes.blockThree}>
                                <div className={classes.blockTitle}><strong><span>Contact info</span></strong></div>
                                <div className={classes.blockContent}>
                                    <ul className={classes.contactInfo}>
                                        <li><b>Address</b><br></br>102 High Road, London, <br></br> N22 6HE, UK </li>
                                        <li><b>Phone</b><br></br>(+44) 020 8881 6812</li>
                                        <li><b>Email</b><br></br><a href="mailto:office@truclothing.com">office@truclothing.com</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.footerMiddle}>
                    <div className={classes.container}>
                        <div className={classes.customBlock}>
                            <div className={classes.blockFour}>
                                <div className={classes.blockTitle}><strong><span>MY ACCOUNT</span></strong></div>
                                <div className={classes.blockMiddleContent}>
                                    <div className={classes.blockSix}>
                                        <ul className={classes.links}>
                                            <li className={classes.textOrange}>
                                                <Link to={'/about-us'}>
                                                    <span>About Us</span>
                                                </Link>
                                            </li>
                                            <li className={classes.textOrange}>
                                                <Link to={'/contact'}>
                                                    <span>Contact Us</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/delivery-and-returns'}>
                                                    <span>Delivery &amp; Returns</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/privacy-policy-cookie-restriction-mode'}>
                                                    <span>Privacy Policy</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className={classes.blockSix}>
                                        <ul className={classes.links}>
                                            <li className={classes.textOrange}>
                                                <Link to={'/customer/account'}>
                                                    <span>Order history</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/catalogsearch/advanced'}>
                                                    <span>Advanced search</span>
                                                </Link>
                                            </li>
                                            <li className={classes.textOrange}>
                                                <Link to={'/customer/account'}>
                                                    <span>My Account</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <a href="mailto:office@truclothing.com" title="Request a Return">Request a Return</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.blockEight}>
                                <div className={classes.blockTitle}><strong><span>Featured Categories</span></strong></div>
                                <div className={classes.blockMiddleContent}>
                                    <div className={classes.blockFour}>
                                        <ul className={classes.features}>
                                            <li className={classes.textOrange}>
                                                <Link to={'/men-s/formal/suits'}>
                                                    <span>Men's Suits</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/men-s/leather'}>
                                                    <span>Men's Leather Jackets</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/men-s/formal/waistcoats'}>
                                                    <span>Men's Waistcoats</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className={classes.blockFour}>
                                        <ul className={classes.features}>
                                            <li>
                                                <Link to={'/men-s/casual/shorts'}>
                                                    <span>Men's Shorts</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/men-s/footwear'}>
                                                    <span>Men's Shoes</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/catalog/category/view/s/leather-66/id/66/'}>
                                                    <span>Ladies' Leather Jackets</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.footerBotoom}>
                    <div className={classes.footerBotoomContainer}>
                        <div className={classes.blockFour}>
                            <div className={classes.copyright}>
                                <div className={pageContainer}>
                                    <address>© 2019 TruClothing. All rights reserved.
                                        <Link to={'/map.html'}>
                                            <span> Sitemap</span>
                                        </Link>
                                    </address>
                                </div>
                            </div>
                        </div>
                        <div className={classes.blockEight}>
                            <div className={classes.subcribe}>
                                <div className={classes.blockTitle}><strong><span>Get the latest deals</span></strong></div>
                                <div className={classes.newsletter}>
                                    <Newsletter customClass='footerNewsletter' onSubmit="" />
                                </div>
                                <div className={classes.blockPaymnent}>
                                    <img alt="Payment" src={PaymentIcon} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.contactPopup}
                </div>
                <button className={classes.backToTopButton} onClick={this.backToTop}>
                    <Icon
                        src={arrowUpIcon}
                        attrs={iconAttrs}
                    />
                </button>
            </footer>
        );
    }
}

const mapStateToProps = ({ catalog }) => {
    const {
        enable_contact
    } = catalog.storeConfig;
    return {
        enable_contact
    };
};

export default compose(
    withRouter,
    classify(defaultClasses),
    connect(
        mapStateToProps,
        null
    )
)(Footer);

