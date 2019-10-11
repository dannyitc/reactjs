import React, { Component, Fragment } from 'react';
import { shape, string } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Button from 'src/components/Button';
import { Form } from 'informed';
import Input from 'src/components/Input';
import classify from 'src/classify';
import defaultClasses from './review.css';
import StarRatingComponent from 'react-star-rating-component';
import { togglePopup } from 'src/actions/app';

class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: '',
            title: '',
            detail: '',
            ratings: {},
            emptyRating: false
        };
    }

    static propTypes = {
        classes: shape({
            root: string,
            actions: string,
            lead: string
        })
    };

    onStarClickPrice(nextValue) {
        const { state } = this;
        const { ratings } = state;
        ratings[3] = nextValue + 10;
        this.setState({
            ratings: ratings
        });

    }

    onStarClickQuality(nextValue) {
        const { state } = this;
        const { ratings } = state;
        ratings[1] = nextValue;
        this.setState({
            ratings: ratings
        });
    }

    handleSubmit = (formValues) => {
        const { product, addReview } = this.props;
        const { ratings } = this.state;
        const emptyRating = !ratings[1] || !ratings[3];
        this.setState({ emptyRating: emptyRating });
        if (emptyRating) {
            return;
        }
        const payload = {
            sku: product.sku,
            data: {
                ...formValues,
                ratings: ratings
            }
        };

        addReview(payload).then(() => {
            this.resetForm();
        });
    };

    get reviews() {
        const { props } = this;
        const { classes, product } = props;
        const reviews = product ? product.review.items : null;
        if (!reviews || !reviews.length) {
            return null;
        }
        const listReviews = reviews.map((review, index) =>
            <li key={index} className={classes.reviewItem}>
                <strong className={classes.reviewTitle}>{review.title}</strong>
                <div className={classes.ratingDetailsWrap}>
                    {
                        review.ratings.map((rating) => {
                            return (
                                <Fragment key={rating.code}>
                                    <div className={classes.ratingDetails}>
                                        <span className={classes.ratingLabel}>{rating.code}</span>
                                        <StarRatingComponent
                                            className={classes.starRating}
                                            name="rating_vote"
                                            value={rating.vote}
                                        />
                                    </div>
                                </Fragment>
                            );
                        })
                    }
                </div>
                <div className={classes.reviewDetails}>
                    <span className={classes.reviewContent}>{review.detail}</span>
                    <span className={classes.reviewBy}>{'Review By '}{review.nickname}<span className={classes.reviewDate}>({'Posted on '}{review.created_at})</span></span>
                </div>
            </li>
        );
        return (
            <div className={classes.reviewListWrap}>
                <h3 className={classes.reviewListTitle}>Customer Reviews</h3>
                <ul className={classes.reviewList}>
                    {listReviews}
                </ul>
            </div>
        );
    }

    resetForm = () => {
        this.formApi.reset();
        this.state = {
            ...this.state,
            ratings: {}
        }
    };

    setApi = formApi => {
        this.formApi = formApi;
    };

    render() {
        const { handleSubmit, reviews, props } = this;
        const { classes, product, isSignedIn, catalog_review_allow_guest, openSignIn, openCreate } = props;

        return (
            <Fragment>
                {reviews}
                {
                    !isSignedIn && !catalog_review_allow_guest
                        ? <div className={classes.message}>
                            Only registered users can write reviews. Please{' '}
                            <Button
                                name="view-order-details"
                                priority="high"
                                onClick={openSignIn}
                            >
                                {'Sign In'}
                            </Button>
                            {' '}or{' '}
                            <Button
                                name="view-order-details"
                                priority="high"
                                onClick={openCreate}
                            >
                                {'create an account'}
                            </Button>
                        </div>
                        : <Form
                            className={classes.reviewForm}
                            getApi={this.setApi}
                            initialValues={this.state}
                            onSubmit={handleSubmit}
                        >
                            <div className={classes.reviewFormTitle}>
                                <h3 className={classes.lead}>
                                    {'You\'re reviewing:'}
                                </h3>
                                <span>{product.name}</span>
                            </div>
                            <div className={classes.ratingFields}>
                                <h4> {'Your Rating'}</h4>
                                <div className={classes.ratingDetails}>
                                    <span className={classes.ratingLabel}>Price</span>
                                    <StarRatingComponent
                                        className={classes.starRating}
                                        name="ratings[3]"
                                        onStarClick={this.onStarClickPrice.bind(this)}
                                    />
                                </div>
                                <div className={classes.ratingDetails}>
                                    <span className={classes.ratingLabel}>Quality</span>
                                    <StarRatingComponent
                                        className={classes.starRating}
                                        name="ratings[1]"
                                        onStarClick={this.onStarClickQuality.bind(this)}
                                    />
                                </div>
                                {
                                    this.state.emptyRating &&
                                    <small>{'Please select one of each of the ratings above.'}</small>
                                }

                            </div>
                            <Input className={classes.reviewInputField}
                                label="Nickname"
                                field="nickname"
                                required
                            />
                            <Input className={classes.reviewInputField}
                                label="Summary"
                                field="title"
                                required
                            />
                            <Input className={classes.reviewInputField}
                                label="Review"
                                field="detail"
                                required
                            />
                            <div className={classes.actions}>
                                <Button type="submit" priority="high">
                                    {'Submit Review'}
                                </Button>
                            </div>
                        </Form>
                }

            </Fragment>
        );
    }
}

const mapStateToProps = ({ user, catalog }) => {
    const { isSignedIn } = user;
    const { catalog_review_allow_guest } = catalog.storeConfig;
    return {
        isSignedIn,
        catalog_review_allow_guest
    };
};

const mapDispatchToProps = dispatch => ({
    openSignIn: () => dispatch(togglePopup('signIn')),
    openCreate: () => dispatch(togglePopup('create')),
});

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Review);
