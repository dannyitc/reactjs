import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './actions.css';
import { compose } from 'redux';
import { withApollo } from 'react-apollo';
import { Link } from 'react-router-dom';
import Icon from 'src/components/Icon';
import HeartIcon from 'react-feather/dist/icons/heart';
import MailIcon from 'react-feather/dist/icons/mail';
import compareIcon from 'react-feather/dist/icons/bar-chart';
import gql from 'graphql-tag';
import LoadingIndicator from 'src/components/LoadingIndicator';
import { toast } from "react-toastify";
import globalClasses from 'src/index.css';
import { openSharePopup } from 'src/actions/catalog';
import { connect } from 'src/drivers';
import compareQuery from 'src/queries/getCompareList.graphql';

const iconDimensions = { height: 20, width: 20 };

const ADD_TODO_WISHLIST = gql`
  mutation addToWishlist($product: Int!) {
    addToWishlist(product: $product)
  }
`;

const ADD_TODO_COMPARE = gql`
    mutation addToCompare($product: Int!) {
        addToCompare(product: $product)
    }
`;
class ProductAction extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            emptyTitle: string,
            continue: string
        })
    };

    constructor() {
        super();
        this.state = {
            isLoading: false
        };
    }

    addToWishList = () => {
        const { togglePopup, client, isSignedIn, product } = this.props;
        if (!isSignedIn) {
            togglePopup('signIn');
            return;
        }
        this.setState({ isLoading: true });
        client.mutate({
            mutation: ADD_TODO_WISHLIST,
            variables: { product: product.id }
        }).then(result => {
            console.log(result);
            toast.success(`You have added ${product.name} to your wishlist.`);
        }).catch(error => {
            console.log(error);
            toast.error("Something wrong.Please try again");
        }).finally(() => {
            this.setState({ isLoading: false });
        });;
    }

    addToCompare = () => {
        const { client, product } = this.props;
        this.setState({ isLoading: true });
        client.mutate({
            mutation: ADD_TODO_COMPARE,
            variables: { product: product.id },
            refetchQueries: [{ query: compareQuery }]
        }).then(result => {
            console.log(result);
            toast.success(`You have added ${product.name} to compare.`);
        }).catch(error => {
            console.log(error);
            toast.error("Something wrong.Please try again");
        }).finally(() => {
            this.setState({ isLoading: false });
        });;
    };

    sendEmailToFriend = () => {
        const { togglePopup, isSignedIn } = this.props;
        if (!isSignedIn) {
            togglePopup('signIn');
            return;
        }
        this.showSharePopup();
    };

    showSharePopup = () => {
        const { modalIsOpen } = globalClasses;
        const bodyClasses = document.querySelector('body').classList;
        this.props.openSharePopup(true);
        bodyClasses.add(modalIsOpen)
    };

    render() {
        const { classes } = this.props;

        return (

            <section className={classes.productAddTo}>
                <Link
                    className={classes.linkAddTo}
                    to="#"
                    onClick={this.addToWishList}
                >
                    <Icon src={HeartIcon} attrs={iconDimensions} />
                    <span>Add To Wishlist</span>
                    {this.state.isLoading
                        ? (<div className={classes.itemActionLoading}>
                            <LoadingIndicator>Adding..</LoadingIndicator>
                        </div>)
                        : null
                    }
                </Link>
                <Link
                    className={classes.linkAddTo}
                    to="#"
                    onClick={this.addToCompare}
                >
                    <Icon src={compareIcon} attrs={iconDimensions} />
                    <span>Add to Compare</span>
                </Link>
                <Link
                    className={classes.linkAddTo}
                    to="#"
                    onClick={this.sendEmailToFriend}
                >
                    <Icon src={MailIcon} attrs={iconDimensions} />
                    <span>Email</span>
                </Link>
            </section>
        );
    }
}

const mapDispatchToProps = {
    openSharePopup
};

export default compose(
    withApollo,
    connect(
        null,
        mapDispatchToProps
    ),
    classify(defaultClasses)
)(ProductAction);
