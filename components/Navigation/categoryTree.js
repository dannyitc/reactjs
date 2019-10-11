import React, { Component, Fragment } from 'react';
import { Query } from 'src/drivers';
import classify from 'src/classify';
import Leaf from './categoryLeaf';
import CategoryTree from './categoryTree';
import defaultClasses from './categoryTree.css';
import navigationMenu from '../../queries/getNavigationMenu.graphql';
import Skeleton from 'react-loading-skeleton';
import Branch from './categoryBranch';


class Tree extends Component {
    menuItemClasses(node) {
        const menuClasses = this.getMenuItemAttributes(node);
        return menuClasses.join(' ');
    }

    getMenuItemAttributes(node) {
        const {
            currentCategoryId,
            activeId,
            parentId,
            currentParrentId
        } = this.props;

        const { children_count } = node;
        const isLeaf = children_count == 0;
        const { menuLevel, hasChildren, parentMenu, menuActive, hasActive, menuParentExpanded, menuExpanded, menuParentCollapsed, menuCollapsed } = defaultClasses;

        const itemClasses = [];

        itemClasses.push(menuLevel);

        if (!isLeaf) {
            itemClasses.push(hasChildren);
            itemClasses.push(parentMenu);
        }

        if (currentCategoryId == node.id) {
            itemClasses.push(menuActive);
        }

        if (currentParrentId == node.id) {
            itemClasses.push(hasActive);
        }

        if (parentId == node.id) {
            if(!itemClasses.includes(menuParentExpanded)) {
                itemClasses.push(menuParentExpanded);
            } else {
                itemClasses.push(menuCollapsed);
            }
        }

        if (activeId == node.id) {
            if(!itemClasses.includes(menuExpanded)) {
                itemClasses.push(menuExpanded);
            } else {
                itemClasses.push(menuCollased);
            }
        }

        return itemClasses;

    }
    
    get leaves() {
        const {
            onNavigate,
            rootNodeId,
            updateRootNodeId,
            updateActiveMenu,
            currentId,
            activeId,
            parentId,
            currentCategoryId,
            currentParrentId
        } = this.props;

        return rootNodeId ? (
            <Query query={navigationMenu} variables={{ id: rootNodeId }}>
                {({ loading, error, data }) => {
                    if (error) return null;
                    if (loading) return <Skeleton width='100%' height='50px' />;

                    const children = data.category.children.sort((a, b) => {
                        if (a.position > b.position) return 1;
                        else if (a.position == b.position && a.id > b.id)
                            return 1;
                        else return -1;
                    });

                    const leaves = children.map(node => {
                        const { children_count } = node;
                        const isLeaf = children_count == 0;
                        const isInclude = !isLeaf && !node.include_in_menu;
                        const elementProps = {
                            rootNodeId: rootNodeId,
                            nodeId: node.id,
                            name: node.name,
                            urlPath: node.url_path,
                            path: node.path
                        };

                        if (!node.include_in_menu && isLeaf) {
                            return null;
                        }

                        const element = isLeaf ? <Leaf {...elementProps} onNavigate={onNavigate} />
                            : (
                                !node.include_in_menu
                                    ? <CategoryTree
                                        key={node.id}
                                        rootNodeId={node.id}
                                        currentCategoryId={currentCategoryId}
                                        rootLevel={node.level}
                                        updateRootNodeId={updateRootNodeId}
                                        updateActiveMenu={updateActiveMenu}
                                        onNavigate={onNavigate}
                                        currentId={currentId}
                                        activeId={activeId}
                                        parentId={parentId}
                                        isInclude={isInclude}
                                    />
                                    : <Fragment>
                                        <Leaf {...elementProps} onNavigate={onNavigate} />
                                        <Branch
                                            {...elementProps}
                                            onDive={updateActiveMenu}
                                        />
                                        <CategoryTree
                                            key={node.id}
                                            rootNodeId={node.id}
                                            currentCategoryId={currentCategoryId}
                                            currentParrentId={currentParrentId}
                                            rootLevel={node.level}
                                            updateRootNodeId={updateRootNodeId}
                                            updateActiveMenu={updateActiveMenu}
                                            onNavigate={onNavigate}
                                            currentId={currentId}
                                            activeId={activeId}
                                            parentId={parentId}
                                        />
                                    </Fragment>

                            );

                        return (
                            !isLeaf && !node.include_in_menu ?
                                element
                                : <li id={node.id} key={node.id} className={this.menuItemClasses(node)}>{element}</li>
                        );
                    });

                    return (
                        <Fragment>
                            {leaves}
                        </Fragment>
                    );
                }}
            </Query>
        ) : null;
    }

    render() {
        const { leaves, props } = this;
        const { classes, rootLevel, isInclude } = props;
        const { categoryTreeMenu, subMenu } = defaultClasses;
        const className = rootLevel ? classes.tree + ' ' + subMenu : categoryTreeMenu;

        return (
            !isInclude ?
                <ul className={className}>
                    {leaves}
                </ul>
                : leaves
        );
    }
}

export default classify(defaultClasses)(Tree);
