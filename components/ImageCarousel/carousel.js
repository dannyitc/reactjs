import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slide from './slideItem';
import Icon from 'src/components/Icon';
import ArrowLeftIcon from 'react-feather/dist/icons/chevron-left';
import ArrowRightIcon from 'react-feather/dist/icons/chevron-right';
import classify from 'src/classify';
import defaultClasses from './carousel.css';

const iconDimensions = { height: 40, width: 40 };

class ImageCarousel extends Component {
    static propTypes = {
        classes: PropTypes.objectOf(PropTypes.string),
        images: PropTypes.arrayOf(PropTypes.string).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            images: this.props.images,
            currentImageIndex: 0
        };

        this.nextSlide = this.nextSlide.bind(this);
        this.previousSlide = this.previousSlide.bind(this);
    }

    previousSlide() {
        const lastIndex = this.state.images.length - 1;
        const { currentImageIndex } = this.state;
        const shouldResetIndex = currentImageIndex === 0;
        const index = shouldResetIndex ? lastIndex : currentImageIndex - 1;

        this.setState({
            currentImageIndex: index
        });
    }

    nextSlide() {
        const lastIndex = this.state.images.length - 1;
        const { currentImageIndex } = this.state;
        const shouldResetIndex = currentImageIndex === lastIndex;
        const index = shouldResetIndex ? 0 : currentImageIndex + 1;

        this.setState({
            currentImageIndex: index
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.sliderWrapper}>
                    <Slide
                        image={this.state.images[this.state.currentImageIndex]}
                    />
                </div>
                <div className={classes.sliderPrevArrow}>
                    <button
                        className={classes.prevArrButton}
                        onClick={this.previousSlide}
                    >
                        <Icon src={ArrowLeftIcon} attrs={iconDimensions} />
                    </button>
                </div>
                <div className={classes.sliderNextArrow}>
                    <button
                        className={classes.nextArrButton}
                        onClick={this.nextSlide}
                    >
                        <Icon src={ArrowRightIcon} attrs={iconDimensions} />
                    </button>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(ImageCarousel);
