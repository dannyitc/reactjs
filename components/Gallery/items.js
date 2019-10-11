import React, { Component } from 'react';
import { array, number } from 'prop-types';
import GalleryItem from './item';

const pageSize = 12;
const emptyData = Array.from({ length: pageSize }).fill(null);

// inline the placeholder elements, since they're constant
const defaultPlaceholders = emptyData.map((_, index) => (
    <GalleryItem key={index} placeholder={true} />
));

class GalleryItems extends Component {
    static propTypes = {
        items: array,
        pageSize: number
    };

    get placeholders() {
        const { pageSize } = this.props;

        return pageSize
            ? Array.from({ length: pageSize })
                .fill(null)
                .map((_, index) => (
                    <GalleryItem key={index} placeholder={true} />
                ))
            : defaultPlaceholders;
    }

    mapGalleryItem(item) {
        const { small_image } = item;
        return {
            ...item,
            small_image:
                typeof small_image === 'object' ? small_image.url : small_image
        };
    }

    render() {
        const { layout, items, isSignedIn } = this.props;

        if (items && items.every(item => item === null)) {
            return this.placeholders;
        }

        return items.map(item => (
            <GalleryItem layout={layout} key={item.id} item={this.mapGalleryItem(item)} isSignedIn={isSignedIn} />
        ));
    }
}

export { GalleryItems as default, emptyData };
