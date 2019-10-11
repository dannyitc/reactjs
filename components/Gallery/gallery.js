import React, { Component } from 'react';
import { string, shape, array } from 'prop-types';

import classify from 'src/classify';
import GalleryItems, { emptyData } from './items';
import defaultClasses from './gallery.css';
import LoadingIndicator from 'src/components/LoadingIndicator';

class Gallery extends Component {
    static propTypes = {
        classes: shape({
            filters: string,
            items: string,
            pagination: string,
            root: string,
            oneItem: string,
            twoItems: string,
            threeItems: string,
            fourItems: string
        }),
        data: array
    };

    static defaultProps = {
        data: emptyData
    };

    render() {
        const { layout, classes, data, pageSize, isSignedIn, isFetching } = this.props;
        const hasData = Array.isArray(data) && data.length;
        const items = hasData ? data : emptyData;

        const classLayout = layout ? classes[layout] : classes.items;
        const layoutPage = this.props.layoutCustom;
        return (
            <div className={classes.root}>
                <div className={classLayout}>
                    {isFetching ? <div className={classes.loading}>
                        <LoadingIndicator />
                    </div> : null}
                    <GalleryItems layout={layoutPage} items={items} pageSize={pageSize} isSignedIn={isSignedIn} />
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(Gallery);
