import React, { Component } from 'react';
import { array, func, oneOfType, shape, string } from 'prop-types';

import { Query } from 'src/drivers';
import classify from 'src/classify';
import Block from './block';
import defaultClasses from './cmsBlock.css';
import getCmsBlocks from '../../queries/getCmsBlocks.graphql';
import './cmsBlocks.scss';
class CmsBlockGroup extends Component {
    static propTypes = {
        children: func,
        classes: shape({
            block: string,
            content: string,
            root: string
        }),
        identifiers: oneOfType([string, array])
    };

    renderBlocks = ({ data, error, loading }) => {
        const { children, classes } = this.props;

        if (error) {
            return null;
        }

        if (loading) {
            return null;
        }

        const { items } = data.cmsBlocks;

        if (!Array.isArray(items) || !items.length) {
            return null;
        }

        const BlockChild = typeof children === 'function' ? children : Block;
        const blocks = items.map((item, index) => (
            <BlockChild
                key={item.identifier}
                className={classes.block}
                index={index}
                {...item}
            />
        ));

        return <div className={classes.content}>{blocks}</div>;
    };

    render() {
        const { props, renderBlocks } = this;
        const { classes, identifiers } = props;

        return (
            <div className={classes.root}>
                <Query query={getCmsBlocks} variables={{ identifiers }}>
                    {renderBlocks}
                </Query>
            </div>
        );
    }
}

export default classify(defaultClasses)(CmsBlockGroup);
