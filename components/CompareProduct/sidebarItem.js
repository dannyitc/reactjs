import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import { compose } from 'redux';
import { Link, resourceUrl, connect } from 'src/drivers';
import classify from 'src/classify';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import { addItemToCart } from 'src/actions/cart';
import xIcon from 'react-feather/dist/icons/x';
import defaultClasses from './item.css';


// TODO: get productUrlSuffix from graphql when it is ready
const productUrlSuffix = '.html';

class SidebarItem extends Component {
    static propTypes = {
        classes: shape({
            image: string,
            image_pending: string,
            imagePlaceholder: string,
            imagePlaceholder_pending: string,
            images: string,
            images_pending: string,
            name: string,
            name_pending: string,
            price: string,
            price_pending: string,
            addItemToCart: string,
            root: string,
            root_pending: string,
            regularPrice: string,
            regularTitle: string
        })
    };

    render() {
        const { classes, item } = this.props;

        const { name, url_key } = item;
        const productLink = `/${url_key}${productUrlSuffix}`;

        return (
            <div className={classes.sidebarItemInfo}>
                <div className={classes.itemActions}>
                    <Button priority="high" onClick={this.removeItem}>
                        <Icon src={xIcon} size={16} />
                    </Button>
                </div>
                <Link to={resourceUrl(productLink)} className={classes.name}>
                    <span>{name}</span>
                </Link>
            </div>
        );
    }

    removeItem = () => {
        const { props } = this;
        const { item, removeItem } = props;

        removeItem(item.id);
    }
}

const mapDispatchToProps = {
    addItemToCart
};

export default compose(
    classify(defaultClasses),
    connect(
        null,
        mapDispatchToProps
    )
)(SidebarItem);
