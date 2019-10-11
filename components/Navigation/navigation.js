import React, { PureComponent } from 'react';

import classify from 'src/classify';
import CategoryTree from './categoryTree';
import NavHeader from './navHeader';
import defaultClasses from './navigation.css';

class Navigation extends PureComponent {
    static getDerivedStateFromProps(props, state) {
        if (!state.rootNodeId && props.rootCategoryId) {
            return {
                ...state,
                rootNodeId: props.rootCategoryId
            };
        }

        return state;
    }

    componentDidMount() {
        this.props.getProductConfig();
        window.addEventListener('scroll', this.listenToScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.listenToScroll)
    }

    listenToScroll = () => {
        const scrollTopYOffset =
            document.body.scrollTop || document.documentElement.scrollTop

        const headerHeight = document.querySelector('header').clientHeight

        const { mainNavFixed } = defaultClasses;
        const navClasses = this.navRef.classList;

        // if (scrollTopYOffset > headerHeight) {
        //     navClasses.add(mainNavFixed)
        // } else {
        //     navClasses.remove(mainNavFixed)
        // }
    }

    state = {
        rootNodeId: null,
        currentPath: null,
        activeId: null,
        parentId: null
    };

    get categoryTree() {
        const { props, setCurrentPath, setCurrentId, state } = this;
        const { rootNodeId, parentId, activeId } = state;
        const { closeDrawer,currentParrentId,currentCategoryId } = props;

        return rootNodeId ? (
            <CategoryTree
                rootNodeId={props.rootCategoryId}
                currentCategoryId={currentCategoryId}
                currentParrentId={currentParrentId}
                currentId={rootNodeId}
                updateRootNodeId={setCurrentPath}
                updateActiveMenu={setCurrentId}
                activeId={activeId}
                parentId={parentId}
                onNavigate={closeDrawer}
            />
        ) : null;
    }

    setCurrentId = currentPath => {
        const path = currentPath.split('/').reverse();
        const currentId = parseInt(path[0]);

        const parentId = path.length > 1 ? parseInt(path[1]) : this.props.rootCategoryId;

        if(currentId != this.state.activeId) {
            this.setState(() => ({
                activeId: currentId,
                parentId: parentId
            }));
        } else {
            this.setState(() => ({
                activeId: -1,
                parentId: parentId
            }));
        }
    };

    setCurrentPath = currentPath => {
        const path = currentPath.split('/').reverse();
        const rootNodeId = parseInt(path[0]);

        this.setState(() => ({
            rootNodeId: rootNodeId,
            currentPath: path
        }));
    };

    setRootNodeIdToParent = () => {
        const path = this.state.currentPath;
        const parentId =
            path.length > 1 ? parseInt(path[1]) : this.props.rootCategoryId;
        path.shift();

        this.setState(() => ({
            rootNodeId: parentId,
            currentPath: path
        }));
    };

    render() {
        const {
            categoryTree,
            hideCreateAccountForm,
            hideSignInForm,
            setRootNodeIdToParent,
            hideForgotPasswordForm,
            props,
            state
        } = this;

        const {
            isCreateAccountOpen,
            isSignInOpen,
            isForgotPasswordOpen,
            rootNodeId
        } = state;
        const {
            classes,
            closeDrawer,
            isOpen,
            isSignedIn,
            rootCategoryId
        } = props;
        const className = isOpen ? classes.root_open : classes.root;
        const isTopLevel = !rootNodeId || rootNodeId === rootCategoryId;

        const handleBack =
            isCreateAccountOpen && !isSignedIn
                ? hideCreateAccountForm
                : isForgotPasswordOpen
                ? hideForgotPasswordForm
                : isSignInOpen && !isSignedIn
                ? hideSignInForm
                : isTopLevel
                ? closeDrawer
                : setRootNodeIdToParent;

        const title = 'Menu';

        return (
            <div ref={(ref) => this.navRef = ref} className={classes.mainNav}>
                <nav className={classes.categoryNav}>{categoryTree}</nav>
                <aside className={className}>
                    <div className={classes.header}>
                        <NavHeader
                            title={title}
                            onBack={handleBack}
                            onClose={closeDrawer}
                        />
                    </div>
                    <nav className={classes.body}>{categoryTree}</nav>
                </aside>
            </div>
        );
    }
}

export default classify(defaultClasses)(Navigation);
