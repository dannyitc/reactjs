import React, { Component } from 'react';
import { shape, string } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './information.css';

class MoreInformation extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            actions: string,
            lead: string
        }),
    };

    render() {
        const { classes, attributes } = this.props;

        return (
            <div className={classes.attributes}>
                <table>
                    <tbody>
                        {
                            attributes.map((attribute) => {
                                return (
                                    <tr key={attribute.code}>
                                        <th className="col label">{attribute.label}</th>
                                        <td className="col data" >{attribute.value}</td>
                                    </tr>
                                );
                            })
                        }

                    </tbody>
                </table>
            </div>
        );
    }
}

export default classify(defaultClasses)(MoreInformation);