import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { resourceUrl } from 'src/drivers';
import classify from 'src/classify';
import defaultClasses from './thumbnail.css';
import { transparentPlaceholder } from 'src/shared/images';
import PlaceHolderImage from 'src/components/Gallery/place_1.svg';

class Thumbnail extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            rootSelected: PropTypes.string
        }),
        isActive: PropTypes.bool,
        item: PropTypes.shape({
            label: PropTypes.string,
            file: PropTypes.string.isRequired
        }),
        itemIndex: PropTypes.number,
        onClickHandler: PropTypes.func.isRequired
    };

    onClickHandlerWrapper = () => {
        const { onClickHandler, itemIndex } = this.props;
        onClickHandler(itemIndex);
    };

    render() {
        const {
            classes,
            isActive,
            item: { file, label }
        } = this.props;
        const src = file
            ? resourceUrl(file, { type: 'image-product', width: 240 })
            : transparentPlaceholder;

        return (
            <button
                onClick={this.onClickHandlerWrapper}
                className={isActive ? classes.rootSelected : classes.root}
            >
                <img onError={this.addDefaultSrc} className={classes.image} src={src} alt={label} />
            </button>
        );
    }

    addDefaultSrc(ev) {
        ev.target.src = PlaceHolderImage;
    }
}

export default classify(defaultClasses)(Thumbnail);
