import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Link, resourceUrl, Route } from 'src/drivers';
import Icon from 'src/components/Icon';
import SearchIcon from 'react-feather/dist/icons/search';
import CustomerIcon from 'react-feather/dist/icons/user';
import MenuIcon from 'react-feather/dist/icons/menu';
import NavTrigger from './navTrigger';
import SearchTrigger from './searchTrigger';
import CartTrigger from './cartTrigger';
import CustomerLinkTrigger from './customerLinkTrigger';
import MiniCart from 'src/components/MiniCart';
import TopLink from 'src/components/TopLink';
import Currency from 'src/components/Currency';
import MailIcon from 'react-feather/dist/icons/mail';
import HelpIcon from 'react-feather/dist/icons/help-circle';
import Navigation from 'src/components/Navigation';
import iFacebook from './facebook.svg';
import iInstagram from './instagram.svg';
import iPhone from './phone.svg';
import Newsletter from 'src/components/Newsletter';
const SearchBar = React.lazy(() => import('src/components/SearchBar'));

import defaultClasses from './header.css';
import Logo from './logo-truclothing.svg';
class Header extends Component {
    static propTypes = {
        history: PropTypes.object,
        classes: PropTypes.shape({
            headerContainer: PropTypes.string,
            headerTop: PropTypes.string,
            logo: PropTypes.string,
            primaryActions: PropTypes.string,
            root: PropTypes.string,
            open: PropTypes.string,
            closed: PropTypes.string,
            secondaryActions: PropTypes.string,
            toolbar: PropTypes.string,
            copyright: PropTypes.string,
            socialWrapper: PropTypes.string,
            socialItems: PropTypes.string,
            searchMobile: PropTypes.string
        }),
        searchOpen: PropTypes.bool,
        toggleSearch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.headerRef = null
    }

    componentDidMount() {
        window.addEventListener('scroll', this.listenToScroll);
        
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.listenToScroll)
    }

    listenToScroll = () => {
        const scrollTopYOffset =
            document.body.scrollTop || document.documentElement.scrollTop

        const headerHeight = this.headerRef.clientHeight

        const { headerFixed } = defaultClasses;
        const headerClasses = document.querySelector('header').classList;

        // if (scrollTopYOffset > headerHeight) {
        //     headerClasses.add(headerFixed)
        // } else {
        //     headerClasses.remove(headerFixed)
        // }
    }

    get searchIcon() {
        return <Icon src={SearchIcon} />;
    }

    render() {
        const {
            drawer: string,
            autocompleteOpen,
            searchOpen,
            customerLinksOpen,
            drawer,
            classes,
            toggleSearch,
            toggleCustomerMenu
        } = this.props;
        const navIsOpen = drawer === 'nav';

        const rootClass = searchOpen ? classes.open : classes.closed;

        const {headerWrapper} = defaultClasses;

        return (
            <header className={headerWrapper}>
                {/* <div className={classes.headerContact}>
                    <a title="Contact" href="https://www.tigren.com/our-services/magento-2-pwa-theme-integration/" target="_blank">
                        <span>Want to convert your magento website to Progressive Web App? Find more information here!</span>
                    </a>
                </div> */}
                
                <div className={classes.headerTop}>
                    <Currency />

                    <div className={classes.headerMiniCart}>
                            <CartTrigger isActive={drawer == 'cart'} />
                            <div className={classes.headerMiniCartContent}>
                                <MiniCart isOpen={drawer == 'cart'} />
                            </div>
                        </div>
                    {/* <div className={classes.headerContainer}>
                        <div className={classes.infoSupport}>
                            <ul>
                                <li><a title="" href="mailto:info@tigren.com" target="_blank"><Icon src={MailIcon} size={14} /> <span>info@tigren.com</span></a></li>
                                <li><a title="Support" href="https://www.tigren.com/support/" target="_blank"><Icon src={HelpIcon} size={14} /><span>Support</span></a></li>
                            </ul>
                        </div>
                        <div className={classes.customerLinks}>
                            <SearchTrigger
                                searchOpen={searchOpen}
                                toggleSearch={toggleSearch}
                            >
                                {this.searchIcon}
                            </SearchTrigger>
                            <CustomerLinkTrigger
                                customerLinksOpen={customerLinksOpen}
                                toggleCustomerMenu={toggleCustomerMenu}
                            >
                                <Icon src={CustomerIcon} />
                            </CustomerLinkTrigger>
                            <TopLink isOpen={customerLinksOpen} />
                        </div>
                    </div> */}
                </div>
                <div ref={(ref) => this.headerRef = ref} className={classes.headerContainer}>
                    <div className={classes.toolbar}>
                        <div className={classes.menuActions}>
                            <NavTrigger>
                                <Icon src={MenuIcon} />
                            </NavTrigger>
                        </div>
                        <Link className={classes.headerLogo} to={resourceUrl('/')}>
                            <img
                                className={classes.logo}
                                src={Logo}
                                alt="Tigren"
                                title="Tigren"
                            />
                        </Link>
                        <div className={classes.secondarySection}>
                            <Suspense fallback={this.searchIcon}>
                                <Route
                                    render={({ history, location }) => (
                                        <SearchBar
                                            autocompleteOpen={autocompleteOpen}
                                            isOpen={searchOpen}
                                            history={history}
                                            location={location}
                                        />
                                    )}
                                />
                            </Suspense>
                        </div>
                        
                    </div>
                    <Navigation isOpen={navIsOpen} />
                    <ul className={classes.socialWrapper}>
                        <li className={classes.socialItems}>
                            <a title="Facebook" href="https://www.facebook.com/TigrenSolutions/" target="_blank" rel="noopener">
                                <img src={iFacebook} alt="" /></a></li>
                        <li className={classes.socialItems}>
                            <a title="Instagram" href="https://www.youtube.com/channel/UCK1jITD8P55rK2rApeP7izw?view_as=subscriber" target="_blank" rel="noopener">
                                <img src={iInstagram} alt="" /></a></li>
                        <li className={classes.socialItems}>
                            <a title="Phone" href="https://www.linkedin.com/company/tigren-solutions" target="_blank" rel="noopener">
                                <img src={iPhone} alt="" /></a></li>
                            <div>020 8881 6812</div>
                    </ul>
                    <Newsletter onSubmit=""/>
                    <div className={classes.copyright}>
                        <address>©Copyright Runawear Ltd 2019 Company Registration no: 07758325 - VAT Registered: 141275338</address>
                    </div>
                    <div className={classes.searchMobile}>
                        <SearchTrigger
                            searchOpen={searchOpen}
                            toggleSearch={toggleSearch}
                        >
                            {this.searchIcon}
                        </SearchTrigger>
                    </div>
                </div>
                
            </header>
        );
    }
}

export default compose(
    withRouter,
    classify(defaultClasses)
)(Header);