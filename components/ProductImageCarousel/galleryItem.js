import React, { Component } from 'react';
import { shape, string, func, number } from 'prop-types';
import { compose } from 'redux';
import classify from 'src/classify';
import defaultClasses from './galleryItem.css';

export class GalleryItem extends Component {
    static propTypes = {
        classes: shape({
            input: string
        }),
        submit: func.isRequired,
        index: number.isRequired
    };

    gotoSlide = () => {
        const { submit, index } = this.props;
        submit(index);
    };

    render() {
        const { classes, image } = this.props;
        const styles = {
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: this.props.slideHeight
        };
        const buttonStyles = {
            width: '100%',
            height: this.props.slideHeight
        };

        return (
            <div className={classes.root} style={styles}>
                <button
                    className={classes.viewItemGallery}
                    onClick={this.gotoSlide}
                    style={buttonStyles}
                />
            </div>
        );
    }
}

export default compose(classify(defaultClasses))(GalleryItem);
