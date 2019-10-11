import React, { Component } from 'react';
import { shape, string } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './breadcrumbs.css';
import { Link, resourceUrl } from 'src/drivers';

class Breadcrumbs extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.breadcrumbs}>
                <ul className={classes.items}>
                    <li className={classes.itemHome}>
                        <Link className={classes.headerLogo} to={resourceUrl('/')}>
                            Home
                        </Link>
                    </li>
                    <li className={classes.item}>
                        {document.title}
                    </li>
                </ul>
            </div>
        );
    }
}

export default classify(defaultClasses)(Breadcrumbs);