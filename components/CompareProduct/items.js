import React, { Component, Fragment } from 'react';
import { string, shape } from 'prop-types';
import defaultClasses from './items.css';
import globalClasses from 'src/index.css';
import Item from './item';
import SidebarItem from './sidebarItem';
import Attribute from './attributes';
const pageSize = 12;
const emptyData = Array.from({ length: pageSize }).fill(null);

class Items extends Component {
    static propTypes = {
        classes: shape({
            tableCompareWrapper: string,
            tableCompare: string
        })
    };

    render() {
        const { layout, items, addToCart, removeItem } = this.props;
        const { compareWrapper, tableCompareWrapper, tableCompare, compareSidebarItems } = defaultClasses;
        const { sidebarBlock, blockTitle, blockContent } = globalClasses;
        return (
            <div className={compareWrapper}>
                {layout != 'sidebar'
                    ? <div className={tableCompareWrapper}>
                        <h1>Compare Products</h1>
                        <table className={tableCompare}>
                            <thead>
                                <tr>
                                    <td>Products</td>
                                    {
                                        items.map(item =>
                                            <Fragment key={item.id}>
                                                <td>
                                                    <Item
                                                        key={item.id}
                                                        item={item}
                                                        addToCart={addToCart}
                                                        removeItem={removeItem}
                                                    />
                                                </td>
                                            </Fragment>
                                        )
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    items[0].attributes.map((attribute) => {
                                        return <tr key={attribute.code}>
                                            <td>{attribute.label}</td>
                                            {
                                                items.map(item =>
                                                    <td><Attribute key={item.id} item={item} attribute={attribute} /></td>
                                                )
                                            }
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                        </div>
                    : <div className={sidebarBlock}>
                        <div className={blockTitle}>
                            <strong>Compare Products</strong>
                        </div>
                        <div className={blockContent}>
                            <ul className={compareSidebarItems}>
                                {
                                    items.map(item =>
                                        <li key={item.id}>
                                            <SidebarItem
                                                item={item}
                                                addToCart={addToCart}
                                                removeItem={removeItem}
                                            />
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
export { Items as default, emptyData } 
